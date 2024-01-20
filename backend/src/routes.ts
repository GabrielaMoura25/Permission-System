import { type FastifyInstance, type FastifyRequest, type FastifyReply, type RouteOptions } from 'fastify'
import { GetUserController } from './controllers/GetUserController'
import { UpdateUserController } from './controllers/UpdateUserController'
import validateToken from './middleware/TokenValidation'
import { updateValidationMiddleware } from './middleware/BodyValidation'

const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/user',
    preHandler: [validateToken],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      await new GetUserController().handle(request, reply)
    }
  },
  {
    method: 'PUT',
    url: '/user',
    preHandler: [validateToken, updateValidationMiddleware],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      await new UpdateUserController().handle(request, reply)
    }
  }
]

export default function routesPlugin (fastify: FastifyInstance, options: any, done: () => void): void {
  routes.forEach((route) => fastify.route(route))
  done()
}
