import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify";
import routes from "./routes/routes";

async function app(
    instance: FastifyInstance,
    opts: FastifyServerOptions,
    done
) {
    instance.get("/", async (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({
            hello: "World",
        });
    });
    instance.register(routes, { prefix: "/api/v1" });
    done();
}

export default app;