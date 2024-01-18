import { FastifyRequest, FastifyReply } from 'fastify';
import Joi from 'joi';

const updateValidationMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = Joi.object({
        firstname: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
    });

    try {
        await schema.validateAsync(request.body);
        return;
    } catch (error: any) {
        reply.code(400).send({ error: error.details.map((detail: any) => detail.message)});
        throw new Error('Validation error');
    };
};

export { updateValidationMiddleware };