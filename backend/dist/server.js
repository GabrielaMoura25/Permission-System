"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_cors = __toESM(require("@fastify/cors"));

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

// src/controllers/UpdateUserController.ts
var UpdateUserController = class {
  async handle(request, reply) {
    const { id } = request.query;
    const { firstname, email } = request.body;
    const userService = new UpdateUserService();
    try {
      const user = await userService.execute(id, email, firstname);
      await reply.send(user);
    } catch (error) {
      await reply.status(400).send({ error: error.message });
    }
  }
};

// src/auth/JwtConfig.ts
var jwt = __toESM(require("jsonwebtoken"));
var secretPassword = "secret_key";
var checkToken = (authorization) => {
  try {
    const payload = jwt.verify(authorization, secretPassword);
    return payload;
  } catch (error) {
    return { hasError: true, error };
  }
};

// src/middleware/TokenValidation.ts
var validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization == null) {
    return res.status(404).send({ message: "Token Not Found" });
  }
  const payload = checkToken(authorization);
  if ("hasError" in payload && payload.hasError) {
    return res.status(401).send({ message: "Expired Token" });
  }
  console.log(payload);
  next();
};
var TokenValidation_default = validateToken;

// src/middleware/BodyValidation.ts
var import_joi = __toESM(require("joi"));
var updateValidationMiddleware = async (request, reply) => {
  const schema = import_joi.default.object({
    firstname: import_joi.default.string().min(3).max(30).required(),
    email: import_joi.default.string().email().required()
  });
  try {
    await schema.validateAsync(request.body);
  } catch (error) {
    await reply.code(400).send({ error: error.details.map((detail) => detail.message) });
    throw new Error("Validation error");
  }
};

// src/routes.ts
var routes = [
  {
    method: "GET",
    url: "/user",
    preHandler: [TokenValidation_default],
    handler: async (request, reply) => {
      await new GetUserController().handle(request, reply);
    }
  },
  {
    method: "PUT",
    url: "/user",
    preHandler: [TokenValidation_default, updateValidationMiddleware],
    handler: async (request, reply) => {
      await new UpdateUserController().handle(request, reply);
    }
  }
];
function routesPlugin(fastify, options, done) {
  routes.forEach((route) => fastify.route(route));
  done();
}

// src/server.ts
var app = (0, import_fastify.default)({ logger: true });
app.setErrorHandler(async (error, _, reply) => {
  await reply.code(400).send({ message: error.message });
});
var start = async () => {
  await app.register(import_cors.default);
  await app.register(routesPlugin);
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
  } catch (err) {
    process.exit(1);
  }
};
void start();
