import { FastifyReply } from 'fastify';

/**
 * Handles the login process for a user.
 * 
 * @param request The incoming request object containing the user information.
 * @param reply The Fastify reply object used to send responses.
 * @returns A promise that resolves to the reply object with the appropriate response.
 */
export async function login(request: any, reply: FastifyReply) {
    const user = request.user;
    const fastify = request.server;

    // Check if user is present in the request
    if (!user) {
        return reply.code(401).send({ message: 'Unauthorized - User information is missing.' });
    }

    // Extracting user id and provider from the user object
    const [providerRaw, id] = user.sub.split("|");
    const provider = providerRaw.replace(/-/g, "_");

    try {
        // Upsert the user information in the database
        const userUpsert = await fastify.prisma.user.upsert({
            where: {
                id,
                email: user.email
            },
            update: {
                nickname: user.nickname,
                name: user.name,
                avatar: user.picture,
                lastLogin: new Date()
            },
            create: {
                id,
                email: user.email,
                nickname: user.nickname,
                name: user.name,
                avatar: user.picture,
                provider
            },
        });

        if (!userUpsert) {
            return reply.code(500).send({ message: "Error during the login process." });
        }

        // Retrieving updated user information
        const userInfo = await fastify.prisma.user.findUnique({ where: { id } });
        if (!userInfo) {
            return reply.code(500).send({ message: "Failed to retrieve user information after login." });
        }

        // Creating a token with user information
        const userToken = {
            id: userInfo.id,
            username: userInfo.username || "",
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar,
            provider: userInfo.provider,
            lastLogin: userInfo.lastLogin
        };

        const token = fastify.jwt.sign(userToken);

        return reply.code(200).send({ token });

    } catch (error: any) {
        // Handle unexpected errors
        return reply.code(500).send({ message: 'Internal Server Error', error: error.message });
    }
}

export async function userManage(request: any, reply: FastifyReply) {
    // const fastify = request.server;

    // // Now you can use Prisma
    // const users = await fastify.prisma.user.findMany();
    const user = request.user;
    console.log(user)
    console.log("inside userManage");
    console.log(process.env.AUTH0_ENDPOINT);

    // Return the fetched data
    return { message: user };
    // Logic for handling /user route
    // You can access request and reply objects here
}


export async function items(request: any, reply: FastifyReply) {
    const fastifyInstance = request.server;
    // Logic for handling /items route
    // You can access request and reply objects here
    return { items: 'List of items' };
}  