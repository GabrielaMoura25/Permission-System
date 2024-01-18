import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateUserService } from '../services/UpdateUserService';

class UpdateUserController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.query as { id: string };
        const { firstname, email } = request.body as { firstname: string, email: string };

        const userService = new UpdateUserService();

        try {
            const user = await userService.execute(id, email, firstname);
    
            reply.send(user);
        } catch (error: any) {
            reply.status(400).send({ error: error.message });
        }
    }
}

export { UpdateUserController };