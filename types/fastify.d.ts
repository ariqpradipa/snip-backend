import { PrismaClient } from '@prisma/client';
import 'fastify';

declare module 'fastify' {
    export interface FastifyInstance {
        prisma: PrismaClient;
    }
}