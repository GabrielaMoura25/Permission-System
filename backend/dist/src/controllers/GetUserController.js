"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/GetUserController.ts
var GetUserController_exports = {};
__export(GetUserController_exports, {
  GetUserController: () => GetUserController
});
module.exports = __toCommonJS(GetUserController_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUserController
});
