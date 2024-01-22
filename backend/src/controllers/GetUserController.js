"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserController = void 0;
const GetUserService_1 = require("../services/GetUserService");
class GetUserController {
    async handle(request, reply) {
        const { email } = request.query;
        const getUserService = new GetUserService_1.GetUserService();
        try {
            const user = await getUserService.execute(email);
            await reply.send(user);
        }
        catch (error) {
            await reply.status(400).send({ error: error.message });
        }
    }
}
exports.GetUserController = GetUserController;
