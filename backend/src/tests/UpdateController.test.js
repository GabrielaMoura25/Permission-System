"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetUserService_1 = require("../services/GetUserService");
const prisma_1 = __importDefault(require("../prisma"));
jest.mock('../prisma', () => ({
    __esModule: true,
    default: {
        users: {
            findFirst: jest.fn()
        }
    }
}));
describe('GetUserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should get user data by email', async () => {
        const getUserService = new GetUserService_1.GetUserService();
        const mockUser = {
            id: '1',
            firstname: 'John',
            email: 'john@example.com',
            permissions: [
                { permission: { name: 'user:profile:email:edit' } },
                { permission: { name: 'other:permission' } }
            ]
        };
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue(mockUser);
        const result = await getUserService.execute('john@example.com');
        const expectedUser = {
            user: {
                id: '1',
                firstname: 'John',
                email: 'john@example.com'
            },
            permissions: ['user:profile:email:edit', 'other:permission']
        };
        expect(result).toEqual(expectedUser);
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
    });
    test('should throw an error for missing user email', async () => {
        const getUserService = new GetUserService_1.GetUserService();
        await expect(getUserService.execute('')).rejects.toThrow('User email are required!');
    });
    test('should throw an error for user not found', async () => {
        const getUserService = new GetUserService_1.GetUserService();
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue(null);
        await expect(getUserService.execute('nonexistent@example.com')).rejects.toThrow('User not found, please enter a valid email');
    });
});
