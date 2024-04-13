import pathLib from "node:path";
import Fastify from "fastify";
import viewEngine from "@fastify/view";
import staticFileEngine from "@fastify/static";
import formbodyEngine from "@fastify/formbody";
import handlebars from "handlebars";
import { getDirname } from "./src/utils.js";
import { getHandler as getIndexHandler, postHandler as postIndexHandler } from "./src/controllers/index.js";
import { getHandler as getResultsHandler } from "./src/controllers/results.js";

const fastify = Fastify({
    logger: true
});

// Setup static files
fastify.register(staticFileEngine, {
    root: pathLib.join(getDirname(import.meta.url), "public"),
    prefix: "/",
});

// Formbody lets us parse incoming forms
fastify.register(formbodyEngine);

// View is a templating manager for fastify
fastify.register(viewEngine, {
    engine: {
        handlebars,
    },
});

// Declare the home route
fastify.get("/",getIndexHandler);
fastify.post("/", postIndexHandler);
fastify.get("/results", getResultsHandler);

// Run the server!
try {
    await fastify.listen({port: process.env.PORT ?? 3000, host: "0.0.0.0"});
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
