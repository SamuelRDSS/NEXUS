import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'reika_neo' },
      update: {},
      create: { name: 'Reika Sato', username: 'reika_neo', email: 'reika@nexus.local', password: 'change-me' },
    }),
    prisma.user.upsert({
      where: { username: 'lucas_uchiha' },
      update: {},
      create: { name: 'Lucas Yamada', username: 'lucas_uchiha', email: 'lucas@nexus.local', password: 'change-me' },
    }),
    prisma.user.upsert({
      where: { username: 'ana_quest' },
      update: {},
      create: { name: 'Ana Kuroda', username: 'ana_quest', email: 'ana@nexus.local', password: 'change-me' },
    }),
  ])

  const posts = [
    'Terminei a última temporada e preciso conversar com alguém sobre esse final.',
    'Minha lista de quero assistir ficou absurda, mas cada série merece uma maratona.',
    'O melhor personagem de RPG não é o mais forte, mas o mais memorável.',
  ]

  for (const [index, content] of posts.entries()) {
    await prisma.post.create({ data: { content, authorId: users[index].id } })
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
