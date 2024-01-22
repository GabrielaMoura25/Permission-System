"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidationMiddleware = void 0;
const joi_1 = __importDefault(require("joi"));
const updateValidationMiddleware = async (request, reply) => {
    const schema = joi_1.default.object({
        firstname: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().email().required()
    });
    try {
        await schema.validateAsync(request.body);
    }
    catch (error) {
        await reply.code(400).send({ error: error.details.map((detail) => detail.message) });
        throw new Error('Validation error');
    }
};
exports.updateValidationMiddleware = updateValidationMiddleware;
