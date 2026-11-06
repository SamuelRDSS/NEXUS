export interface Post {
  id: string
  author: string
  handle: string
  text: string
  likes: number
  comments: number
  tag: string
  kind?: 'bot' | 'demo'
  image?: string
  imageAlt?: string
  poll?: string[]
}

export const posts: Post[] = [
  { id: 'post-reika', author: 'Reika Sato', handle: '@reika_neo', text: 'Terminei a última temporada e preciso conversar com alguém sobre esse final. A cena final foi tão absurda quanto perfeita.', likes: 1200, comments: 183, tag: '#Final', image: '/assets/otaku-1.jpg', imageAlt: 'Arte de demonstração de uma comunidade otaku' },
  { id: 'post-lucas', author: 'Lucas Yamada', handle: '@lucas_uchiha', text: 'Minha lista de quero assistir ficou absurda, mas cada uma dessas séries merece uma semana inteira de maratona.', likes: 864, comments: 61, tag: '#Recomendação' },
  { id: 'post-ana', author: 'Ana Kuroda', handle: '@ana_quest', text: 'O melhor personagem de RPG não é o mais forte, mas o mais memorável. Tenho uma teoria sobre protagonistas quebrados.', likes: 2100, comments: 218, tag: '#Discussão', poll: ['O estrategista', 'O coração do grupo', 'O personagem misterioso'] },
  { id: 'post-yuri', author: 'Yuri Tanaka', handle: '@yuri_frames', text: 'Qual abertura vocês nunca pulam? A minha atual tem uma combinação de cores e música que me ganha toda vez.', likes: 532, comments: 47, tag: '#Música' },
  { id: 'post-mika', author: 'Mika Arai', handle: '@mika_mangá', text: 'Domingo de leitura: separei três volumes para colocar a semana em dia. Aceito recomendações de histórias curtas!', likes: 398, comments: 29, tag: '#Mangá' },
  { id: 'post-ren', author: 'Ren Oliveira', handle: '@ren_pixel', text: 'Montei uma playlist instrumental para estudar. Temas de jogos e trilhas de fantasia são meu foco hoje.', likes: 716, comments: 83, tag: '#Games' },
  { id: 'post-hana', author: 'Hana Mori', handle: '@hana_cos', text: 'Primeiro teste de figurino concluído! Ainda falta ajustar alguns detalhes, mas já estou feliz com o resultado.', likes: 1450, comments: 126, tag: '#Cosplay', image: '/assets/otaku-3.jpg', imageAlt: 'Imagem ilustrativa para uma publicação de cosplay' },
  { id: 'post-kai', author: 'Kai Nunes', handle: '@kai_watchlist', text: 'Maratona em grupo é melhor que assistir sozinho. Deixei uma lista de opções para a próxima sessão da comunidade.', likes: 284, comments: 34, tag: '#Comunidade' },
]
