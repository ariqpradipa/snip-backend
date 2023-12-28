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

        // Set a cookie with the token
        reply.setCookie('snip_token', "Bearer " + token, {
            path: '/',
            httpOnly: true, // Recommended for security purposes
            secure: process.env.NODE_ENV === 'production', // Secure flag in production
            maxAge: 7 * 24 * 60 * 60 // Expires in 1 day
        });

        return reply.code(200).send({ token });

    } catch (error: any) {
        // Handle unexpected errors
        return reply.code(500).send({ message: 'Internal Server Error', error: error.message });
    }
}