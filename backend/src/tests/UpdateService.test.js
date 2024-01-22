"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const UpdateUserService_1 = require("../services/UpdateUserService");
jest.mock('../prisma', () => ({
    users: {
        findFirst: jest.fn(),
        update: jest.fn()
    },
    permissions: {
        findMany: jest.fn()
    }
}));
describe('UpdateUserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should throw an error if user id is not provided', async () => {
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        await expect(updateUserService.execute('', 'new-email@example.com')).rejects.toThrowError('User id is required!');
    });
    test('should throw an error if user is not found', async () => {
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue(null);
        await expect(updateUserService.execute('1', 'new-email@example.com')).rejects.toThrowError('User not found!');
    });
    test('should throw an error if user does not have permission to edit email', async () => {
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'john@example.com' });
        prisma_1.default.permissions.findMany = jest.fn().mockResolvedValue([{ name: 'user:profile:firstname:edit' }]);
        prisma_1.default.users.update = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'josh@example.com' });
        await expect(updateUserService.execute('1', 'josh@example.com', 'John')).rejects.toThrowError('Permission denied to edit email.');
    });
    test('should throw an error if user does not have permission to edit firstname', async () => {
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        prisma_1.default.users.findFirst = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'john@example.com' });
        prisma_1.default.permissions.findMany = jest.fn().mockResolvedValue([{ name: 'user:profile:email:edit' }]);
        prisma_1.default.users.update = jest.fn().mockResolvedValue({ id: '1', firstname: 'Josh', email: 'john@example.com' });
        await expect(updateUserService.execute('1', '', 'Josh')).rejects.toThrowError('Permission denied to edit firstname.');
    });
});
