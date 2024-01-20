import { GetUserService } from '../services/GetUserService'
import prismaClient from '../prisma'

jest.mock('../prisma', () => ({
  __esModule: true,
  default: {
    users: {
      findFirst: jest.fn()
    }
  }
}))

describe('GetUserService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should get user data by email', async () => {
    const getUserService = new GetUserService()
    const mockUser = {
      id: '1',
      firstname: 'John',
      email: 'john@example.com',
      permissions: [
        { permission: { name: 'user:profile:email:edit' } },
        { permission: { name: 'other:permission' } }
      ]
    }

    prismaClient.users.findFirst = jest.fn().mockResolvedValue(mockUser)

    const result = await getUserService.execute('john@example.com')

    const expectedUser = {
      user: {
        id: '1',
        firstname: 'John',
        email: 'john@example.com'
      },
      permissions: ['user:profile:email:edit', 'other:permission']
    }

    expect(result).toEqual(expectedUser)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaClient.users.findFirst).toHaveBeenCalledWith({
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
    })
  })

  test('should throw an error for missing user email', async () => {
    const getUserService = new GetUserService()

    await expect(getUserService.execute('')).rejects.toThrow('User email are required!')
  })

  test('should throw an error for user not found', async () => {
    const getUserService = new GetUserService()

    prismaClient.users.findFirst = jest.fn().mockResolvedValue(null)

    await expect(getUserService.execute('nonexistent@example.com')).rejects.toThrow(
      'User not found, please enter a valid email'
    )
  })
})
