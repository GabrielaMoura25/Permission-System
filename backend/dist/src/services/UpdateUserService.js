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

// src/services/UpdateUserService.ts
var UpdateUserService_exports = {};
__export(UpdateUserService_exports, {
  UpdateUserService: () => UpdateUserService
});
module.exports = __toCommonJS(UpdateUserService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateUserService
});
