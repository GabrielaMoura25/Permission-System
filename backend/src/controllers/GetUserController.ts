import { FastifyRequest, FastifyReply } from 'fastify';
import { GetUserService } from '../services/GetUserService';

class GetUserController {

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { email } = request.query as { email: string };
        const getUserService = new GetUserService();

        try {
            const user = await getUserService.execute(email);
    
            reply.send(user);
        } catch (error: any) {
            reply.status(400).send({ error: error.message });
        }
    }
}

export { GetUserController };