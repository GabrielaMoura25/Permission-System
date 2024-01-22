"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetUserController_1 = require("../controllers/GetUserController");
const GetUserService_1 = require("../services/GetUserService");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('../services/GetUserService');
describe('GetUserController', () => {
    let mockRequest;
    let mockReply;
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        mockRequest = {};
        mockReply = {
            send: globals_1.jest.fn().mockReturnThis(),
            status: globals_1.jest.fn().mockReturnThis()
        };
    });
    afterEach(() => {
        globals_1.jest.clearAllMocks();
    });
    test('should handle request and send user data on successful execution', async () => {
        const getUserController = new GetUserController_1.GetUserController();
        const mockUserData = {
            user: {
                id: '1',
                firstname: 'John',
                email: 'john@example.com'
            },
            permissions: ['user:profile:email:edit', 'other:permission']
        };
        globals_1.jest.spyOn(GetUserService_1.GetUserService.prototype, 'execute').mockResolvedValueOnce(mockUserData);
        mockRequest.query = { email: 'john@example.com' };
        await getUserController.handle(mockRequest, mockReply);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(GetUserService_1.GetUserService.prototype.execute).toHaveBeenCalledWith('john@example.com');
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockReply.send).toHaveBeenCalledWith(mockUserData);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockReply.status).not.toHaveBeenCalled();
    });
    test('should handle request and send error message on service error', async () => {
        const getUserController = new GetUserController_1.GetUserController();
        const errorMessage = 'User not found!';
        globals_1.jest.spyOn(GetUserService_1.GetUserService.prototype, 'execute').mockRejectedValueOnce(new Error(errorMessage));
        mockRequest.query = { email: 'nonexistent@example.com' };
        await getUserController.handle(mockRequest, mockReply);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(GetUserService_1.GetUserService.prototype.execute).toHaveBeenCalledWith('nonexistent@example.com');
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockReply.status).toHaveBeenCalledWith(400);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockReply.send).toHaveBeenCalledWith({ error: errorMessage });
    });
});
