import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

export async function checkToken(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    console.log("inside checkToken");
    // const token = request.headers.authorization;

    // // Implement your token validation logic here
    // const isValidToken = true; // Replace this with actual token validation

    // if (!isValidToken) {
    //     reply.code(401).send({ error: 'Invalid token' });
    //     return;
    // }

    // If the token is valid, proceed to the next handler
    done();
}
