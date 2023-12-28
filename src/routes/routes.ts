import { FastifyInstance } from 'fastify';
import { checkToken } from '../middlewares/checkToken';
import { userManage } from '../controllers/userManage';

export default async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/user', { preHandler: checkToken }, userManage);

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
