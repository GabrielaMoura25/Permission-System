import { checkToken } from '../auth/JwtConfig';
import { FastifyRequest, FastifyReply } from 'fastify';

const validateToken = (req: FastifyRequest, res: FastifyReply, next: Function) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(404).send({ message: 'Token Not Found' });
    }

    const payload = checkToken(authorization);
    if('hasError' in payload && payload.hasError) {
        return res.status(401).send({ message: 'Expired Token' });
    }

    console.log(payload);
    
    next();
};

export default validateToken;