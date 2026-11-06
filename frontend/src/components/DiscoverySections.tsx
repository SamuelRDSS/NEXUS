import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronRight, Crown, Sparkles, Users } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  sourceUrl: string
  category: string
  publishedAt: string | null
}

interface NewsResponse {
  articles: NewsArticle[]
  sources: { id: string; name: string; status: 'ok' | 'unavailable' }[]
  errors: string[]
  stale?: boolean
  updatedAt?: string
}

function NewsSection() {
  const [news, setNews] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

    fetch(`${apiUrl}/api/news`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`API respondeu com HTTP ${response.status}`)
        return response.json() as Promise<NewsResponse>
      })
      .then(setNews)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        const message = reason instanceof Error ? reason.message : 'Erro desconhecido'
        console.error('Não foi possível carregar as notícias externas:', reason)
        setError(message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [retry])

  return (
    <section className="hub-section" id="news">
      <div className="section-heading">
        <div><span className="section-kicker">FONTES EXTERNAS · RSS</span><h2>Notícias & novidades</h2></div>
        <span className="demo-label">LINKS PARA AS FONTES</span>
      </div>
      <p className="hub-disclaimer">Manchetes, categorias e datas são fornecidas por Anime News Network e Anime Corner. Os links abrem as matérias nas fontes originais; parte do conteúdo pode estar em inglês.</p>
      {loading && <p className="news-status" role="status">Carregando manchetes das fontes...</p>}
      {error && (
        <div className="news-error" role="alert">
          <span>Não foi possível carregar as manchetes. Verifique se a API está em execução e tente novamente. ({error})</span>
          <button type="button" className="secondary-button" onClick={() => { setLoading(true); setError(''); setRetry((current) => current + 1) }}>Tentar novamente</button>
        </div>
      )}
      {news?.stale && <p className="news-source-warning" role="status">Exibindo manchetes em cache de {news.updatedAt ? new Date(news.updatedAt).toLocaleString('pt-BR') : 'uma consulta anterior'}.</p>}
      {news?.errors.map((sourceError) => <p className="news-source-warning" role="status" key={sourceError}>{sourceError} As outras fontes continuam disponíveis.</p>)}
      {news && news.articles.length === 0 && !error && <p className="news-status">As fontes não retornaram manchetes agora. Tente novamente mais tarde.</p>}
      <div className="story-grid">
        {news?.articles.map((article) => (
          <article className="story-card live-story" key={article.id}>
            <div className="story-cover" aria-hidden="true"><span>{article.category || 'Geek'}</span></div>
            <div className="story-content">
              <span className="story-category">{article.category || 'Geek'}</span>
              <a className="story-source" href={article.sourceUrl} target="_blank" rel="noreferrer">{article.source}</a>
              <h3>{article.title}</h3>
              <p>{article.publishedAt ? new Date(article.publishedAt).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Data não informada pela fonte'}</p>
              <a className="text-button story-link" href={article.url} target="_blank" rel="noreferrer">Ler na fonte <ArrowRight size={14} /></a>
            </div>
          </article>
        ))}
      </div>
      {news?.sources && <p className="source-list">Fontes: {news.sources.map((source) => `${source.name}${source.status === 'ok' ? '' : ' (indisponível)'}`).join(' · ')}</p>}
    </section>
  )
}

const communities = [
  { name: 'One Piece · Navegantes', description: 'Teorias, jornadas e aventuras no mar.', members: '1,2 mil', icon: '☠️' },
  { name: 'Naruto · Vila da Folha', description: 'Clãs, personagens e histórias ninja.', members: '846', icon: '🍥' },
  { name: 'Jujutsu Kaisen · Feiticeiros', description: 'Discussões e teorias da comunidade.', members: '692', icon: '✦' },
  { name: 'RPG & Fantasia', description: 'Campanhas, builds e mundos fantásticos.', members: '421', icon: '🎲' },
]

const quizzes = [
  { title: 'Conhecimentos gerais', question: 'Qual gênero costuma acompanhar jornadas mágicas em mundos imaginários?', options: ['Fantasia', 'Suspense', 'Slice of life'], answer: 'Fantasia' },
  { title: 'Quem é esse personagem?', question: 'Qual pista ajuda mais a identificar um personagem em um quiz?', options: ['Silhueta e acessórios', 'Cor do fundo', 'Tamanho da imagem'], answer: 'Silhueta e acessórios' },
  { title: 'Qual personagem combina?', question: 'O que mais combina com um personagem estrategista?', options: ['Planejamento', 'Sorte apenas', 'Agir sem pensar'], answer: 'Planejamento' },
]

const rankings = {
  Animes: ['Jardim de Estrelas', 'Lendas do Vento', 'Tokyo Requiem'],
  Personagens: ['Mika Arai', 'Yuri Tanaka', 'Reika Sato'],
  Aberturas: ['Aurora Neon', 'Vento do Norte', 'Afterglow'],
}

type RankingCategory = keyof typeof rankings

export function DiscoverySections() {
  const [joined, setJoined] = useState<string[]>([])
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizIndex, setQuizIndex] = useState(0)
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>('Animes')
  const activeQuiz = quizzes[quizIndex]

  const toggleCommunity = (name: string) => {
    setJoined((current) => current.includes(name)
      ? current.filter((community) => community !== name)
      : [...current, name])
  }

  return (
    <div className="discovery-sections">
      <NewsSection />

      <section className="hub-section" id="communities">
        <div className="section-heading">
          <div><span className="section-kicker">ENCONTRE SUA TURMA</span><h2>Comunidades em destaque</h2></div>
          <span className="demo-label">MEMBROS DEMONSTRATIVOS</span>
        </div>
        <div className="community-grid">
          {communities.map((community, index) => {
            const isJoined = joined.includes(community.name)
            return (
              <article className={`hub-community community-cover-${index + 1}`} key={community.name}>
                <div className="community-cover"><span aria-hidden="true">{community.icon}</span></div>
                <div className="community-content">
                  <h3>{community.name}</h3>
                  <p>{community.description}</p>
                  <span className="community-members"><Users size={14} /> {community.members} membros · demo</span>
                  <button className={isJoined ? 'primary-button community-join joined' : 'primary-button community-join'} type="button" aria-pressed={isJoined} onClick={() => toggleCommunity(community.name)}>
                    {isJoined ? <><Check size={15} /> Participando</> : 'Entrar na comunidade'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="hub-section interactive-grid">
        <article className="hub-panel" id="quizzes">
          <div className="section-heading compact-heading">
            <div><span className="section-kicker">JOGUE COM A COMUNIDADE</span><h2>Quiz rápido</h2></div>
            <Sparkles size={18} />
          </div>
          <label className="quiz-picker">Escolha um desafio
            <select value={quizIndex} onChange={(event) => { setQuizIndex(Number(event.target.value)); setQuizAnswer('') }}>
              {quizzes.map((quiz, index) => <option value={index} key={quiz.title}>{quiz.title}</option>)}
            </select>
          </label>
          <p className="quiz-question">{activeQuiz.question}</p>
          <div className="hub-quiz-options">
            {activeQuiz.options.map((answer) => (
              <button type="button" key={answer} className={quizAnswer === answer ? 'hub-quiz-option selected' : 'hub-quiz-option'} aria-pressed={quizAnswer === answer} onClick={() => setQuizAnswer(answer)}>{answer}</button>
            ))}
          </div>
          {quizAnswer && <p className="quiz-result" role="status">{quizAnswer === activeQuiz.answer ? 'Resposta certa! Pontuação: 1/1.' : `Quase! A resposta deste quiz demonstrativo é ${activeQuiz.answer}.`}</p>}
          <span className="hub-footnote">Quiz demonstrativo · resultado local</span>
        </article>

        <article className="hub-panel" id="rankings">
          <div className="section-heading compact-heading">
            <div><span className="section-kicker">EM ALTA NA NEXUS</span><h2>Rankings</h2></div>
            <Crown size={18} />
          </div>
          <div className="ranking-tabs" aria-label="Categoria do ranking">
            {(Object.keys(rankings) as RankingCategory[]).map((category) => (
              <button type="button" key={category} className={rankingCategory === category ? 'filter-chip active' : 'filter-chip'} aria-pressed={rankingCategory === category} onClick={() => setRankingCategory(category)}>{category}</button>
            ))}
          </div>
          <ol className="hub-ranking-list">
            {rankings[rankingCategory].map((item, index) => (
              <li key={item}><span className="hub-ranking-number">0{index + 1}</span><strong>{item}</strong><span>{[982, 845, 710][index]} pts demo</span><ChevronRight size={15} /></li>
            ))}
          </ol>
          <span className="hub-footnote">Dados fictícios para demonstrar a interface</span>
        </article>
      </section>
    </div>
  )
}
