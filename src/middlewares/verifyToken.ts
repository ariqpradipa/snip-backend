import { FastifyReply } from 'fastify';

export async function verifyToken(request: any, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    const fastify = request.server;

    if (!authHeader) {
        reply.code(401).send({ error: 'Missing authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = await fastify.jwt.verify(token);
        request.user = user;
    } catch (error) {
        reply.code(401).send({ error: 'Invalid token' });
        return;
    }
}