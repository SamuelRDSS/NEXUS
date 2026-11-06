import asyncio
import html
import os
import re
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any, Generator
from urllib.parse import urlparse

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import DateTime, ForeignKey, String, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, selectinload


def database_url() -> str:
    url = os.environ["DATABASE_URL"]
    return url.replace("postgres://", "postgresql+psycopg://", 1).replace(
        "postgresql://", "postgresql+psycopg://", 1
    )


engine = create_engine(database_url(), pool_pre_ping=True)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "User"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    username: Mapped[str] = mapped_column(String, unique=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")


class Post(Base):
    __tablename__ = "Post"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    content: Mapped[str] = mapped_column(String)
    createdAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    authorId: Mapped[str] = mapped_column(ForeignKey("User.id", ondelete="CASCADE"))
    author: Mapped[User] = relationship(back_populates="posts")
    likes: Mapped[list["Like"]] = relationship(back_populates="post")


class Like(Base):
    __tablename__ = "Like"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    userId: Mapped[str] = mapped_column(ForeignKey("User.id", ondelete="CASCADE"))
    postId: Mapped[str] = mapped_column(ForeignKey("Post.id", ondelete="CASCADE"))
    createdAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    post: Mapped[Post] = relationship(back_populates="likes")


class AuthorResponse(BaseModel):
    name: str
    username: str


class PostResponse(BaseModel):
    id: str
    content: str
    createdAt: datetime
    author: AuthorResponse
    likes: int


app = FastAPI(title="Nexus Otaku API")
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_FEEDS = (
    {
        "id": "anime-news-network",
        "name": "Anime News Network",
        "url": "https://www.animenewsnetwork.com/all/rss.xml",
        "domain": "animenewsnetwork.com",
    },
    {
        "id": "anime-corner",
        "name": "Anime Corner",
        "url": "https://animecorner.me/feed/",
        "domain": "animecorner.me",
    },
)
NEWS_CACHE_SECONDS = 600
NEWS_MAX_BYTES = 1_000_000
_news_cache: dict[str, Any] | None = None
_news_cache_at = 0.0
BOT_PROMPTS = (
    "Qual anime você recomendaria para alguém que quer começar a explorar esse universo? Conte o motivo, sem spoilers.",
    "Se pudesse passar um dia no mundo de um anime, qual escolheria e o que faria primeiro?",
    "Qual abertura combina melhor com uma maratona hoje? Vale defender sua escolha!",
    "Que personagem merece mais reconhecimento? Apresente seu argumento para a comunidade.",
    "Qual jogo ou anime você gostaria de esquecer para poder descobrir tudo de novo?",
    "Monte uma equipe de três personagens de universos diferentes. Quem você escolheria?",
    "Qual trilha sonora geek não pode faltar na sua playlist?",
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(engine)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "nexus-otaku-api"}


def _local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def _clean_feed_text(value: str) -> str:
    text = re.sub(r"<[^>]*>", " ", value)
    return html.unescape(" ".join(text.split()))


def _valid_article_url(value: str, domain: str) -> bool:
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower()
    return (
        parsed.scheme == "https"
        and (host == domain or host.endswith(f".{domain}"))
        and parsed.username is None
        and parsed.password is None
    )


class _FeedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self, domain: str) -> None:
        super().__init__()
        self.domain = domain

    def redirect_request(
        self,
        request: urllib.request.Request,
        file: Any,
        code: int,
        message: str,
        headers: Any,
        new_url: str,
    ) -> urllib.request.Request | None:
        if not _valid_article_url(new_url, self.domain):
            raise RuntimeError("O feed tentou redirecionar para um domínio não aprovado.")
        return super().redirect_request(request, file, code, message, headers, new_url)


def _fetch_news_source(source: dict[str, str]) -> dict[str, Any]:
    request = urllib.request.Request(
        source["url"],
        headers={"User-Agent": "NexusOtakuNewsReader/1.0 (+RSS reader)"},
    )
    try:
        opener = urllib.request.build_opener(_FeedRedirectHandler(source["domain"]))
        with opener.open(request, timeout=8) as response:
            payload = response.read(NEWS_MAX_BYTES + 1)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise RuntimeError(f"Falha ao consultar {source['name']}.") from exc

    if len(payload) > NEWS_MAX_BYTES:
        raise RuntimeError(f"O feed de {source['name']} excedeu o tamanho permitido.")

    try:
        root = ET.fromstring(payload)
    except ET.ParseError as exc:
        raise RuntimeError(f"O feed de {source['name']} retornou XML inválido.") from exc

    articles = []
    for item in (node for node in root.iter() if _local_name(node.tag) == "item"):
        fields: dict[str, list[str]] = {}
        for child in item:
            fields.setdefault(_local_name(child.tag), []).append(
                "".join(child.itertext()).strip()
            )

        title = _clean_feed_text((fields.get("title") or [""])[0])
        link = (fields.get("link") or [""])[0].strip()
        if not title or not _valid_article_url(link, source["domain"]):
            continue

        raw_date = (fields.get("pubdate") or fields.get("published") or [""])[0]
        try:
            parsed_date = parsedate_to_datetime(raw_date)
            if parsed_date.tzinfo is None:
                parsed_date = parsed_date.replace(tzinfo=timezone.utc)
            published_at = parsed_date.astimezone(timezone.utc)
        except (TypeError, ValueError, OverflowError):
            published_at = None

        articles.append(
            {
                "id": f"{source['id']}:{link}",
                "title": title[:300],
                "url": link,
                "source": source["name"],
                "sourceUrl": f"https://{source['domain']}/",
                "category": _clean_feed_text((fields.get("category") or ["Geek"])[0])[:80],
                "publishedAt": published_at.isoformat() if published_at else None,
            }
        )
        if len(articles) == 12:
            break
    return {"articles": articles, "status": "ok"}


@app.get("/api/news")
async def news() -> dict[str, Any]:
    global _news_cache, _news_cache_at

    now = time.monotonic()
    if _news_cache is not None and now - _news_cache_at < NEWS_CACHE_SECONDS:
        return _news_cache

    results = await asyncio.gather(
        *(asyncio.to_thread(_fetch_news_source, source) for source in NEWS_FEEDS),
        return_exceptions=True,
    )
    articles: list[dict[str, Any]] = []
    source_statuses = []
    errors = []
    for source, result in zip(NEWS_FEEDS, results):
        if isinstance(result, BaseException):
            source_statuses.append(
                {"id": source["id"], "name": source["name"], "status": "unavailable"}
            )
            errors.append(f"{source['name']}: {result}")
            continue
        articles.extend(result["articles"])
        source_statuses.append(
            {"id": source["id"], "name": source["name"], "status": "ok"}
        )

    if not articles and _news_cache is None:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Não foi possível carregar as fontes de notícias.",
                "sources": source_statuses,
            },
        )

    articles.sort(
        key=lambda article: article["publishedAt"] or "",
        reverse=True,
    )
    response = {
        "articles": articles[:16],
        "sources": source_statuses,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "errors": errors,
    }
    if articles:
        _news_cache = response
        _news_cache_at = now
        return response
    return {
        **_news_cache,
        "sources": source_statuses,
        "errors": errors,
        "stale": True,
    }


@app.get("/api/bot/daily-post")
def daily_bot_post() -> dict[str, Any]:
    today = datetime.now(timezone.utc).date()
    prompt_index = today.toordinal() % len(BOT_PROMPTS)
    return {
        "id": f"nexus-bot-{today.isoformat()}",
        "author": "Nexus Bot",
        "handle": "@nexus_bot",
        "text": BOT_PROMPTS[prompt_index],
        "tag": "#PerguntaDoDia",
        "kind": "bot",
        "likes": 0,
        "comments": 0,
        "publishedAt": datetime.combine(today, datetime.min.time(), timezone.utc).isoformat(),
    }


@app.get("/api/posts", response_model=list[PostResponse])
def posts(session: Session = Depends(get_session)) -> list[PostResponse]:
    query = (
        select(Post)
        .options(selectinload(Post.author), selectinload(Post.likes))
        .order_by(Post.createdAt.desc())
    )
    records = session.scalars(query).all()
    return [
        PostResponse(
            id=post.id,
            content=post.content,
            createdAt=post.createdAt,
            author=AuthorResponse(name=post.author.name, username=post.author.username),
            likes=len(post.likes),
        )
        for post in records
    ]
