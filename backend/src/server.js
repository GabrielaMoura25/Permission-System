"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, fastify_1.default)({ logger: true });
app.setErrorHandler(async (error, _, reply) => {
    await reply.code(400).send({ message: error.message });
});
const start = async () => {
    await app.register(cors_1.default);
    await app.register(routes_1.default);
    try {
        await app.listen({ port: 3333 });
    }
    catch (err) {
        process.exit(1);
    }
};
void start();
