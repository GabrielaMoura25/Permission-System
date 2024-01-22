"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetUserController_1 = require("./controllers/GetUserController");
const UpdateUserController_1 = require("./controllers/UpdateUserController");
const TokenValidation_1 = __importDefault(require("./middleware/TokenValidation"));
const BodyValidation_1 = require("./middleware/BodyValidation");
const routes = [
    {
        method: 'GET',
        url: '/user',
        preHandler: [TokenValidation_1.default],
        handler: async (request, reply) => {
            await new GetUserController_1.GetUserController().handle(request, reply);
        }
    },
    {
        method: 'PUT',
        url: '/user',
        preHandler: [TokenValidation_1.default, BodyValidation_1.updateValidationMiddleware],
        handler: async (request, reply) => {
            await new UpdateUserController_1.UpdateUserController().handle(request, reply);
        }
    }
];
function routesPlugin(fastify, options, done) {
    routes.forEach((route) => fastify.route(route));
    done();
}
exports.default = routesPlugin;
