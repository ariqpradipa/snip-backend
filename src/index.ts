import { Prisma, PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie';

const fastifyEnv = require('@fastify/env')
const fastifyJWT = require('@fastify/jwt')

import routes from './routes/routes'

const prisma = new PrismaClient()
const app = fastify({ logger: true })

const schema = {
  type: 'object',
  required: ['PORT', 'AUTH0_ENDPOINT'],
  properties: {
    PORT: {
      type: 'string',
      default: '5000'
    },
    AUTH0_ENDPOINT: {
      type: 'string'
    },
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema, // optional, default: undefined
  dotenv: true, // optional, default: true
  data: process.env // optional, default: process.env
}

app.decorate('prisma', prisma);

async function initialize() {
  try {
    // Load environment variables
    await app.register(fastifyEnv, options);

    app.register(fastifyJWT, {
      secret: process.env.JWY_SECRET, // Use the loaded config
      sign: {
        expiresIn: '7d'
      }
    }); // After loading env, register JWT
    app.register(fastifyCookie); // Register cookie plugin (after loading env
    app.register(routes); // Register routes

    await app.ready();

    app.listen({ port: Number(process.env.PORT) }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server ready at: http://localhost:${Number(process.env.PORT)}`);
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// initialize and start the server
initialize();