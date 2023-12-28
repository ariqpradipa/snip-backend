import { FastifyReply } from 'fastify';

export async function verifyAccessToken(request: any, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        reply.code(401).send({ message: 'Missing authorization header' });
        return; // Stop processing the request
    }

    try {
        const res = await fetch(`${process.env.AUTH0_ENDPOINT}/userinfo`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        });

        if (!res.ok) {
            // If the token is invalid or expired, send a 401 Unauthorized response
            reply.code(401).send({ message: 'Invalid token' });
            return; // Stop processing the request
        }

        const user = await res.json();

        // Store user info in request for downstream handlers
        // continue to the next handler
        request.user = user;

    } catch (error) {
        // In case of any other error, Fastify will automatically send a 500 Internal Server Error
        // You can log the error for debugging purposes
        console.error('Error verifying token:', error);
        throw new Error('Internal Server Error');
    }
}