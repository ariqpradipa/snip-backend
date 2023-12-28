import { FastifyReply } from 'fastify';

export async function createOrganization(request: any, reply: FastifyReply) {
    const fastify = request.server;

    const { organizationCode, name, description, contact } = request.body;

    // max length of organizationCode is 20 min is 4
    if (organizationCode.length > 20 || organizationCode.length < 4) {
        return reply.code(400).send({ error: 'Invalid organizationCode length' });
    }

    const organization = await fastify.prisma.organization.create({
        data: {
            organizationCode,
            name,
            description,
            contact,
        },
    });

    if (!organization) {
        return reply.code(500).send({ error: 'Failed to create organization' });
    }

    return reply.code(201).send(organization);
}

export async function updateOrganization(request: any, reply: FastifyReply) {
    const fastify = request.server;

    const { id, organizationCode, name, description, contact } = request.body;

    const organization = await fastify.prisma.organization.update({
        where: {
            id,
            organizationCode,
        },
        data: {
            name,
            description,
            contact,
        },
    });

    if (!organization) {
        return reply.code(500).send({ error: 'Failed to update organization' });
    }

    return reply.code(200).send(organization);
}

export async function deleteOrganization(request: any, reply: FastifyReply) {
    const fastify = request.server;

    const { id, organizationCode } = request.body;

    const organization = await fastify.prisma.organization.delete({
        where: {
            id,
            organizationCode,
        },
    });

    if (!organization) {
        return reply.code(500).send({ error: 'Failed to delete organization' });
    }

    return reply.code(200).send(organization);
}