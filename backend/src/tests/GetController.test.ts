import { type FastifyRequest, type FastifyReply } from 'fastify'
import { GetUserController } from '../controllers/GetUserController'
import { GetUserService } from '../services/GetUserService'
import { jest } from '@jest/globals'

jest.mock('../services/GetUserService')

describe('GetUserController', () => {
  let mockRequest: FastifyRequest
  let mockReply: FastifyReply

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    mockRequest = {} as FastifyRequest
    mockReply = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as unknown as FastifyReply
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should handle request and send user data on successful execution', async () => {
    const getUserController = new GetUserController()
    const mockUserData = {
      user: {
        id: '1',
        firstname: 'John',
        email: 'john@example.com'
      },
      permissions: ['user:profile:email:edit', 'other:permission']
    }

    jest.spyOn(GetUserService.prototype, 'execute').mockResolvedValueOnce(mockUserData)

    mockRequest.query = { email: 'john@example.com' }

    await getUserController.handle(mockRequest, mockReply)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(GetUserService.prototype.execute).toHaveBeenCalledWith('john@example.com')

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockReply.send as jest.Mock).toHaveBeenCalledWith(mockUserData)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockReply.status).not.toHaveBeenCalled()
  })

  test('should handle request and send error message on service error', async () => {
    const getUserController = new GetUserController()
    const errorMessage = 'User not found!'

    jest.spyOn(GetUserService.prototype, 'execute').mockRejectedValueOnce(new Error(errorMessage))

    mockRequest.query = { email: 'nonexistent@example.com' }

    await getUserController.handle(mockRequest, mockReply)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(GetUserService.prototype.execute).toHaveBeenCalledWith('nonexistent@example.com')

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockReply.status).toHaveBeenCalledWith(400)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockReply.send).toHaveBeenCalledWith({ error: errorMessage })
  })
})
