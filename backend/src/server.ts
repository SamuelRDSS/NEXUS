import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = Number(process.env.PORT ?? 8000)

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'nexus-otaku-api' })
})

app.get('/api/posts', async (_request, response) => {
  const posts = await prisma.post.findMany({
    include: { author: { select: { name: true, username: true } }, _count: { select: { likes: true } } },
    orderBy: { createdAt: 'desc' },
  })
  response.json(posts)
})

app.listen(port, () => {
  console.log(`Nexus Otaku API running at http://localhost:${port}`)
})
