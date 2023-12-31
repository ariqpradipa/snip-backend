"use strict";
// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

import { Prisma, PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie';

// const fastifyEnv = require('@fastify/env')
const fastifyJWT = require('@fastify/jwt')

import routes from './routes/routes'

const prisma = new PrismaClient()
const app = fastify({ logger: true })

app.decorate('prisma', prisma);

app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET, // Use the loaded config
    sign: {
        expiresIn: '7d'
    }
});
app.register(fastifyCookie); // Register cookie plugin (after loading env
app.register(routes); // Register routes

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}