import Fastify from 'fastify'
import cors from '@fastify/cors'
import routesPlugin from './routes'

const app = Fastify({ logger: true })

app.setErrorHandler(async (error, _, reply) => {
  await reply.code(400).send({ message: error.message })
})

const start = async (): Promise<void> => {
  await app.register(cors)
  await app.register(routesPlugin)

  try {
    await app.listen({ port: 3333 })
  } catch (err) {
    process.exit(1)
  }
}

void start()
