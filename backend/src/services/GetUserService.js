"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class GetUserService {
    async execute(email) {
        if (email.length === 0) {
            throw new Error('User email are required!');
        }
        const user = await prisma_1.default.users.findFirst({
            where: { email },
            select: {
                id: true,
                firstname: true,
                email: true,
                permissions: {
                    select: {
                        permission: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        if (user == null)
            throw new Error('User not found, please enter a valid email');
        const formattedUser = {
            user: {
                id: user.id,
                firstname: user.firstname,
                email: user.email
            },
            permissions: user?.permissions.map(permission => permission.permission.name)
        };
        return formattedUser;
    }
    ;
}
exports.GetUserService = GetUserService;
