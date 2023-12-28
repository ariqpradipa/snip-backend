import { FastifyInstance } from 'fastify';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { login, userManage } from '../controllers/authController';

export default async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/auth/login', { preHandler: verifyAccessToken }, login);

    // // GET /user
    // fastify.get('/user', async (request: FastifyRequest, reply: FastifyReply) => {
    //     // Your logic for /user
    //     return { user: 'User data' };
    // });

    // // GET /items
    // fastify.get('/items', async (request: FastifyRequest, reply: FastifyReply) => {
    //     // Your logic for /items
    //     return { items: 'List of items' };
    // });

    // // POST /signin
    // fastify.post('/signin', async (request: FastifyRequest, reply: FastifyReply) => {
    //     // Your logic for /signin
    //     return { status: 'Signed in' };
    // });

    // // POST /login
    // fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    //     // Your logic for /login
    //     return { status: 'Logged in' };
    // });
}
