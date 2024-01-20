import prismaClient from '../prisma'
import { UpdateUserService } from '../services/UpdateUserService'

jest.mock('../prisma', () => ({
  users: {
    findFirst: jest.fn(),
    update: jest.fn()
  },
  permissions: {
    findMany: jest.fn()
  }
}))

describe('UpdateUserService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should throw an error if user id is not provided', async () => {
    const updateUserService = new UpdateUserService()

    await expect(updateUserService.execute('', 'new-email@example.com')).rejects.toThrowError('User id is required!')
  })

  test('should throw an error if user is not found', async () => {
    const updateUserService = new UpdateUserService()
    prismaClient.users.findFirst = jest.fn().mockResolvedValue(null)

    await expect(updateUserService.execute('1', 'new-email@example.com')).rejects.toThrowError('User not found!')
  })

  test('should throw an error if user does not have permission to edit email', async () => {
    const updateUserService = new UpdateUserService()

    prismaClient.users.findFirst = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'john@example.com' })
    prismaClient.permissions.findMany = jest.fn().mockResolvedValue([{ name: 'user:profile:firstname:edit' }])
    prismaClient.users.update = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'josh@example.com' })

    await expect(updateUserService.execute('1', 'josh@example.com', 'John')).rejects.toThrowError('Permission denied to edit email.')
  })

  test('should throw an error if user does not have permission to edit firstname', async () => {
    const updateUserService = new UpdateUserService()

    prismaClient.users.findFirst = jest.fn().mockResolvedValue({ id: '1', firstname: 'John', email: 'john@example.com' })
    prismaClient.permissions.findMany = jest.fn().mockResolvedValue([{ name: 'user:profile:email:edit' }])
    prismaClient.users.update = jest.fn().mockResolvedValue({ id: '1', firstname: 'Josh', email: 'john@example.com' })

    await expect(updateUserService.execute('1', '', 'Josh')).rejects.toThrowError('Permission denied to edit firstname.')
  })
})
