import { FastifyInstance } from 'fastify';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { verifyToken } from '../middlewares/verifyToken';
import { login } from '../controllers/authController';

import { createOrganization, updateOrganization, deleteOrganization } from '../controllers/organizationController';
import { inviteUser, acceptInvitation, declineInviation, changeUserRole, deleteUser } from '../controllers/organizationUserController';

export default async function routes(fastify: FastifyInstance, options: any): Promise<void> {

    // on / route, return a message
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    })

    // authentication
    fastify.get('/auth/login', { preHandler: verifyAccessToken }, login);

    // organizations handler
    fastify.post('/organization/create', { preHandler: verifyToken }, createOrganization)
    fastify.post('/organization/update', { preHandler: verifyToken }, updateOrganization)
    fastify.delete('/organization/delete', { preHandler: verifyToken }, deleteOrganization)

    // organizationUser handler
    fastify.post('/organizationUser/invite', { preHandler: verifyToken }, inviteUser)
    fastify.post('/organizationUser/accept', { preHandler: verifyToken }, acceptInvitation)
    fastify.post('/organizationUser/decline', { preHandler: verifyToken }, declineInviation)
    fastify.post('/organizationUser/changeRole', { preHandler: verifyToken }, changeUserRole)
    fastify.delete('/organizationUser/delete', { preHandler: verifyToken }, deleteUser)
}
