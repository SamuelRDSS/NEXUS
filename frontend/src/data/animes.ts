export interface Anime {
  title: string
  genre: string
  score: string
  synopsis: string
  poster: string
}

export const animes: Anime[] = [
  { title: 'Tokyo Requiem', genre: 'Ação · Shonen · Fantasia', score: '9.2', synopsis: 'Uma equipe improvável percorre uma cidade fantástica em busca de respostas.', poster: '/assets/otaku-1.jpg' },
  { title: 'Silent Cipher', genre: 'Psicológico · Mistério', score: '9.4', synopsis: 'Uma investigação de mistério em que cada pista muda a perspectiva da história.', poster: '/assets/otaku-2.jpg' },
  { title: 'Neon Drift', genre: 'Cyberpunk · Sci-fi', score: '8.9', synopsis: 'Uma piloto atravessa uma metrópole futurista enquanto questiona quem controla a cidade.', poster: '/assets/otaku-3.jpg' },
  { title: 'Jardim de Estrelas', genre: 'Fantasia · Drama', score: '8.7', synopsis: 'Dois viajantes encontram um jardim que guarda memórias de mundos distantes.', poster: '/assets/otaku-4.jpg' },
  { title: 'Café Lunar', genre: 'Slice of life · Romance', score: '8.5', synopsis: 'Encontros cotidianos em um café acolhedor sob um céu sempre estrelado.', poster: '/assets/character-banner.jpg' },
  { title: 'Lendas do Vento', genre: 'Aventura · Fantasia', score: '9.0', synopsis: 'Uma jornada por ilhas flutuantes para descobrir a origem dos ventos antigos.', poster: '/assets/comuni-banner-2.jpg' },
]

export const matches = ['Lucas', 'Ana', 'Yuri']

export const interests = ['Jujutsu Kaisen', 'Elden Ring', 'Cyberpunk', 'Mind games']
