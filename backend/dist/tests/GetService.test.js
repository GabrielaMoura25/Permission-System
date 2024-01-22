"use strict";

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/GetUserService.ts
var GetUserService = class {
  async execute(email) {
    if (email.length === 0) {
      throw new Error("User email are required!");
    }
    const user = await prisma_default.users.findFirst({
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
      throw new Error("User not found, please enter a valid email");
    const formattedUser = {
      user: {
        id: user.id,
        firstname: user.firstname,
        email: user.email
      },
      permissions: user?.permissions.map((permission) => permission.permission.name)
    };
    return formattedUser;
  }
};

// src/tests/GetService.test.ts
jest.mock("../prisma", () => ({
  users: {
    findFirst: jest.fn()
  }
}));
describe("GetUserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should execute and return formatted user data", async () => {
    const mockUser = {
      id: "1",
      firstname: "John",
      email: "john@example.com",
      permissions: [
        {
          permission: {
            name: "user:profile:email:edit"
          }
        },
        {
          permission: {
            name: "other:permission"
          }
        }
      ]
    };
    prisma_default.users.findFirst = jest.fn().mockResolvedValue(mockUser);
    const getUserService = new GetUserService();
    const result = await getUserService.execute("john@example.com");
    expect(prisma_default.users.findFirst).toHaveBeenCalledWith({
      where: { email: "john@example.com" },
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
        id: "1",
        firstname: "John",
        email: "john@example.com"
      },
      permissions: ["user:profile:email:edit", "other:permission"]
    };
    expect(result).toEqual(expectedFormattedUser);
  });
  test("should throw an error for missing email", async () => {
    const getUserService = new GetUserService();
    await expect(getUserService.execute("")).rejects.toThrow("User email are required!");
  });
  test("should throw an error for user not found", async () => {
    prisma_default.users.findFirst = jest.fn().mockResolvedValue(null);
    const getUserService = new GetUserService();
    await expect(getUserService.execute("nonexistent@example.com")).rejects.toThrow(
      "User not found, please enter a valid email"
    );
  });
});
