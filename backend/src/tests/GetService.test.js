"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const GetUserService_1 = require("../services/GetUserService");
jest.mock('../prisma', () => ({
    users: {
        findFirst: jest.fn()
    }
}));
describe('GetUserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should execute and return formatted user data', async () => {
        const mockUser = {
            id: '1',
            firstname: 'John',
            email: 'john@example.com',
            permissions: [
                {
                    permission: {
                        name: 'user:profile:email:edit'
                    }
                },
                {
                    permission: {
                        name: 'other:permission'
                    }
                }
            ]
        };
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue(mockUser);
        const getUserService = new GetUserService_1.GetUserService();
        const result = await getUserService.execute('john@example.com');
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma_1.default.users.findFirst).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
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
        const expectedFormattedUser = {
            user: {
                id: '1',
                firstname: 'John',
                email: 'john@example.com'
            },
            permissions: ['user:profile:email:edit', 'other:permission']
        };
        expect(result).toEqual(expectedFormattedUser);
    });
    test('should throw an error for missing email', async () => {
        const getUserService = new GetUserService_1.GetUserService();
        await expect(getUserService.execute('')).rejects.toThrow('User email are required!');
    });
    test('should throw an error for user not found', async () => {
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue(null);
        const getUserService = new GetUserService_1.GetUserService();
        await expect(getUserService.execute('nonexistent@example.com')).rejects.toThrow('User not found, please enter a valid email');
    });
});
