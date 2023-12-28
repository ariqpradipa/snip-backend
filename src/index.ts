import { Prisma, PrismaClient } from '@prisma/client'
import fastify from 'fastify'

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

// await app.register(fastifyEnv, options);
// app.register(fastifyJWT, {
//   secret: process.env.AUTH0_SECRET,
//   sign: {
//     expiresIn: '1h'
//   }
// })
// app.register(routes);

// // Fire up the server
// (async () => {
//   try {
//     await app.ready()

//     app.listen({ port: Number(process.env.PORT) }, (err) => {
//       if (err) {
//         console.error(err)
//         process.exit(1)
//       }
//       console.log(`🚀 Server ready at: http://localhost:${Number(process.env.PORT)}`)
//     })
//   } catch (error) {
//     app.log.error(error)
//     process.exit(1)
//   }
// })()


// app.post<{
//   Body: ISignupBody
// }>(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts?.map((post: Prisma.PostCreateInput) => {
//     return { title: post?.title, content: post?.content }
//   })

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   return result
// })

// app.post<{
//   Body: ICreatePostBody
// }>(`/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   return result
// })

// app.put<{
//   Params: IPostByIdParam
// }>('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     return post
//   } catch (error) {
//     return { error: `Post with ID ${id} does not exist in the database` }
//   }
// })

// app.put<{
//   Params: IPostByIdParam
// }>('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData?.published },
//     })
//     return updatedPost
//   } catch (error) {
//     return { error: `Post with ID ${id} does not exist in the database` }
//   }
// })

// app.delete<{
//   Params: IPostByIdParam
// }>(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   return post
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   return users
// })

// app.get<{
//   Params: IPostByIdParam
// }>('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: { id: Number(id) },
//     })
//     .posts({
//       where: { published: false },
//     })

//   return drafts
// })

// app.get<{
//   Params: IPostByIdParam
// }>(`/post/:id`, async (req, res) => {
//   const { id } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   return post
// })

// app.get<{
//   Querystring: IFeedQueryString
// }>('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req?.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//       OR: [
//         { title: { contains: searchString as string } },
//         { content: { contains: searchString as string } },
//       ],
//     }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   return posts
// })
interface IFeedQueryString {
  searchString: string | null
  skip: number | null
  take: number | null
  orderBy: Prisma.SortOrder | null
}

interface IPostByIdParam {
  id: number
}

interface ICreatePostBody {
  title: string
  content: string | null
  authorEmail: string
}

// interface ISignupBody {
//   name: string | null
//   email: string
//   posts: Prisma.PostCreateInput[]
// }