"use strict";

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/UpdateUserService.ts
var UpdateUserService = class {
  async execute(id, email, firstname) {
    if (id.length === 0) {
      throw new Error("User id is required!");
    }
    const findUser = await prisma_default.users.findFirst({
      where: { id }
    });
    if (findUser == null) {
      throw new Error("User not found!");
    }
    const findPermissions = await prisma_default.permissions.findMany({
      where: {
        usersPermissions: {
          some: {
            userId: id
          }
        }
      },
      select: { name: true }
    });
    if (email != null && firstname != null && findPermissions.some((permission) => permission.name === "user:profile:email:edit") && findPermissions.some((permission) => permission.name === "user:profile:firstname:edit")) {
      const updatedUser = await prisma_default.users.update({
        where: { id },
        data: { firstname, email },
        select: { firstname: true, email: true }
      });
      return updatedUser;
    }
    ;
    if (email != null && findPermissions.some((permission) => permission.name === "user:profile:email:edit")) {
      if (firstname !== findUser.firstname) {
        throw new Error("Permission denied to edit firstname.");
      }
      const updatedUser = await prisma_default.users.update({
        where: { id },
        data: { email },
        select: { firstname: true, email: true }
      });
      return updatedUser;
    }
    ;
    if (firstname != null && findPermissions.some((permission) => permission.name === "user:profile:firstname:edit")) {
      if (email !== findUser.email) {
        throw new Error("Permission denied to edit email.");
      }
      const updateUser = await prisma_default.users.update({
        where: { id },
        data: { firstname },
        select: { firstname: true, email: true }
      });
      return updateUser;
    }
    throw new Error("User does not have the required permissions for the update.");
  }
};

// src/tests/UpdateService.test.ts
jest.mock("../prisma", () => ({
  users: {
    findFirst: jest.fn(),
    update: jest.fn()
  },
  permissions: {
    findMany: jest.fn()
  }
}));
describe("UpdateUserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should throw an error if user id is not provided", async () => {
    const updateUserService = new UpdateUserService();
    await expect(updateUserService.execute("", "new-email@example.com")).rejects.toThrowError("User id is required!");
  });
  test("should throw an error if user is not found", async () => {
    const updateUserService = new UpdateUserService();
    prisma_default.users.findFirst = jest.fn().mockResolvedValue(null);
    await expect(updateUserService.execute("1", "new-email@example.com")).rejects.toThrowError("User not found!");
  });
  test("should throw an error if user does not have permission to edit email", async () => {
    const updateUserService = new UpdateUserService();
    prisma_default.users.findFirst = jest.fn().mockResolvedValue({ id: "1", firstname: "John", email: "john@example.com" });
    prisma_default.permissions.findMany = jest.fn().mockResolvedValue([{ name: "user:profile:firstname:edit" }]);
    prisma_default.users.update = jest.fn().mockResolvedValue({ id: "1", firstname: "John", email: "josh@example.com" });
    await expect(updateUserService.execute("1", "josh@example.com", "John")).rejects.toThrowError("Permission denied to edit email.");
  });
  test("should throw an error if user does not have permission to edit firstname", async () => {
    const updateUserService = new UpdateUserService();
    prisma_default.users.findFirst = jest.fn().mockResolvedValue({ id: "1", firstname: "John", email: "john@example.com" });
    prisma_default.permissions.findMany = jest.fn().mockResolvedValue([{ name: "user:profile:email:edit" }]);
    prisma_default.users.update = jest.fn().mockResolvedValue({ id: "1", firstname: "Josh", email: "john@example.com" });
    await expect(updateUserService.execute("1", "", "Josh")).rejects.toThrowError("Permission denied to edit firstname.");
  });
});
