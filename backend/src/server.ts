import Fastify from 'fastify'
import cors from '@fastify/cors'
import routesPlugin from './routes'

const port = process.env.PORT != null ? Number(process.env.PORT) : 3333

const app = Fastify({ logger: true })

app.setErrorHandler(async (error, _, reply) => {
  await reply.code(400).send({ message: error.message })
})

const start = async (): Promise<void> => {
  await app.register(cors)
  await app.register(routesPlugin)

  try {
    await app.listen({ port })
    console.log(`Server listening on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
