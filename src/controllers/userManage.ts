import { FastifyRequest, FastifyReply } from 'fastify';

export async function userManage(request: FastifyRequest, reply: FastifyReply) {
    // const fastify = request.server;

    // // Now you can use Prisma
    // const users = await fastify.prisma.user.findMany();

    console.log("inside userManage");

    // Return the fetched data
    return { message: "you are great" };
    // Logic for handling /user route
    // You can access request and reply objects here
}


export async function items(request: FastifyRequest, reply: FastifyReply) {
    const fastifyInstance = request.server;
    // Logic for handling /items route
    // You can access request and reply objects here
    return { items: 'List of items' };
}  