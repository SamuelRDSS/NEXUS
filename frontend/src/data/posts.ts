export interface Post {
  author: string
  handle: string
  text: string
  likes: string
  comments: string
  tag: string
}

export const posts: Post[] = [
  { author: 'Reika Sato', handle: '@reika_neo', text: 'Terminei a última temporada e preciso conversar com alguém sobre esse final. A cena final foi tão absurda quanto perfeita.', likes: '1.2K', comments: '183', tag: '#Final' },
  { author: 'Lucas Yamada', handle: '@lucas_uchiha', text: 'Minha lista de quero assistir ficou absurda, mas cada uma dessas séries merece uma semana inteira de maratona.', likes: '864', comments: '61', tag: '#Recomendação' },
  { author: 'Ana Kuroda', handle: '@ana_quest', text: 'O melhor personagem de RPG não é o mais forte, mas o mais memorável. Tenho uma teoria sobre protagonistas quebrados.', likes: '2.1K', comments: '218', tag: '#Discussão' },
]
