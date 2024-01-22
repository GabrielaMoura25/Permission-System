"use strict";

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/prisma/seed.ts
var usersData = [
  {
    firstname: "John",
    email: "john@mailforspam.com",
    permissions: [
      "user:profile:view",
      "user:profile:firstname:view",
      "user:profile:email:view",
      "user:profile:firstname:edit",
      "user:profile:email:edit"
    ]
  },
  {
    firstname: "Gabriela",
    email: "gabriela@mailforspam.com",
    permissions: [
      "user:profile:view",
      "user:profile:firstname:view",
      "user:profile:email:view",
      "user:profile:email:edit"
    ]
  },
  {
    firstname: "Fernando",
    email: "fernando@mailforspam.com",
    permissions: [
      "user:profile:view",
      "user:profile:firstname:view",
      "user:profile:email:view",
      "user:profile:firstname:edit"
    ]
  },
  {
    firstname: "Lais",
    email: "lais@mailforspam.com",
    permissions: [
      "user:profile:view",
      "user:profile:firstname:view",
      "user:profile:email:view"
    ]
  }
];
async function main() {
  const existingUsers = await prisma_default.users.findMany();
  if (existingUsers.length > 0) {
    for (const user of existingUsers) {
      await prisma_default.usersPermissions.deleteMany({
        where: {
          userId: user.id
        }
      });
    }
    await prisma_default.users.deleteMany();
    console.log("Existing users deleted.");
  }
  for (const userData of usersData) {
    const permissions = userData.permissions.map((permission) => ({ name: permission }));
    const user = await prisma_default.users.create({
      data: {
        firstname: userData.firstname,
        email: userData.email,
        permissions: {
          create: permissions.map((permissionData) => ({
            permission: { create: permissionData }
          }))
        }
      }
    });
    console.log("User created:", user);
  }
  await prisma_default.$disconnect();
}
void main();
