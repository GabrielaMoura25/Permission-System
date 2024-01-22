"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const UpdateUserService_1 = require("../services/UpdateUserService");
class UpdateUserController {
    async handle(request, reply) {
        const { id } = request.query;
        const { firstname, email } = request.body;
        const userService = new UpdateUserService_1.UpdateUserService();
        try {
            const user = await userService.execute(id, email, firstname);
            await reply.send(user);
        }
        catch (error) {
            await reply.status(400).send({ error: error.message });
        }
    }
}
exports.UpdateUserController = UpdateUserController;
