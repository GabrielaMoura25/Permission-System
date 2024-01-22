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

// src/controllers/GetUserController.ts
var GetUserController = class {
  async handle(request, reply) {
    const { email } = request.query;
    const getUserService = new GetUserService();
    try {
      const user = await getUserService.execute(email);
      await reply.send(user);
    } catch (error) {
      await reply.status(400).send({ error: error.message });
    }
  }
};

// node_modules/@jest/globals/build/index.js
throw new Error(
  "Do not import `@jest/globals` outside of the Jest test environment"
);

// src/tests/GetController.test.ts
(void 0).mock("../services/GetUserService");
describe("GetUserController", () => {
  let mockRequest;
  let mockReply;
  beforeEach(() => {
    mockRequest = {};
    mockReply = {
      send: (void 0).fn().mockReturnThis(),
      status: (void 0).fn().mockReturnThis()
    };
  });
  afterEach(() => {
    (void 0).clearAllMocks();
  });
  test("should handle request and send user data on successful execution", async () => {
    const getUserController = new GetUserController();
    const mockUserData = {
      user: {
        id: "1",
        firstname: "John",
        email: "john@example.com"
      },
      permissions: ["user:profile:email:edit", "other:permission"]
    };
    (void 0).spyOn(GetUserService.prototype, "execute").mockResolvedValueOnce(mockUserData);
    mockRequest.query = { email: "john@example.com" };
    await getUserController.handle(mockRequest, mockReply);
    expect(GetUserService.prototype.execute).toHaveBeenCalledWith("john@example.com");
    expect(mockReply.send).toHaveBeenCalledWith(mockUserData);
    expect(mockReply.status).not.toHaveBeenCalled();
  });
  test("should handle request and send error message on service error", async () => {
    const getUserController = new GetUserController();
    const errorMessage = "User not found!";
    (void 0).spyOn(GetUserService.prototype, "execute").mockRejectedValueOnce(new Error(errorMessage));
    mockRequest.query = { email: "nonexistent@example.com" };
    await getUserController.handle(mockRequest, mockReply);
    expect(GetUserService.prototype.execute).toHaveBeenCalledWith("nonexistent@example.com");
    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({ error: errorMessage });
  });
});
