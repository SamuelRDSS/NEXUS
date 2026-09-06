import os
from datetime import datetime
from typing import Generator

from fastapi import Depends, FastAPI
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
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
