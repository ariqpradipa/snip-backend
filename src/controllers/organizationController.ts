import { FastifyReply } from 'fastify';

export async function getOrganizationById(request: any, reply: FastifyReply) {
    const fastify = request.server;

    const { id } = request.body;

    const organization = await fastify.prisma.organization.findUnique({
        where: {
            id,
        },
    });

    if (!organization) {
        return reply.code(404).send({ error: 'Organization not found' });
    }

    return reply.code(200).send(organization);
}

export async function getAllOrganizations(request: any, reply: FastifyReply) {
    const fastify = request.server;
    const user = request.user;

    const userOrganizations = await fastify.prisma.organizationUser.findMany({
        where: {
            userId: user.id,
        },
        include: {
            organization: true, // Include the organization details
        },
    });

    // Extract just the organization details from the query result
    const organizations = userOrganizations.map((orgUser: any) => orgUser.organization);

    return reply.code(200).send(organizations);
}

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

    if (!await validateUserOrganizationRole(fastify, request.user.id, id)) {
        return reply.code(403).send({ error: 'User is not an admin of this organization' });
    }

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

    if (!await validateUserOrganizationRole(fastify, request.user.id, id)) {
        return reply.code(403).send({ error: 'User is not an admin of this organization' });
    }

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

// Utility to check if user is part of an organization and is an admin
async function validateUserOrganizationRole(fastify: any, userId: string, organizationId: string): Promise<boolean> {
    const organizationUser = await fastify.prisma.organizationUser.findFirst({
        where: {
            userId,
            organizationId,
        },
    });

    return organizationUser && organizationUser.role === 'admin';
}
