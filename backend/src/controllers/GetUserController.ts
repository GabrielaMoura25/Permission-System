import { type FastifyRequest, type FastifyReply } from 'fastify'
import { GetUserService } from '../services/GetUserService'

class GetUserController {
  async handle (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { email } = request.query as { email: string }
    const getUserService = new GetUserService()

    try {
      const user = await getUserService.execute(email)

      await reply.send(user)
    } catch (error: any) {
      await reply.status(400).send({ error: error.message })
    }
  }
}

export { GetUserController }
