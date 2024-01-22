"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const usersData = [
    {
        firstname: 'John',
        email: 'john@mailforspam.com',
        permissions: [
            'user:profile:view',
            'user:profile:firstname:view',
            'user:profile:email:view',
            'user:profile:firstname:edit',
            'user:profile:email:edit'
        ]
    },
    {
        firstname: 'Gabriela',
        email: 'gabriela@mailforspam.com',
        permissions: [
            'user:profile:view',
            'user:profile:firstname:view',
            'user:profile:email:view',
            'user:profile:email:edit'
        ]
    },
    {
        firstname: 'Fernando',
        email: 'fernando@mailforspam.com',
        permissions: [
            'user:profile:view',
            'user:profile:firstname:view',
            'user:profile:email:view',
            'user:profile:firstname:edit'
        ]
    },
    {
        firstname: 'Lais',
        email: 'lais@mailforspam.com',
        permissions: [
            'user:profile:view',
            'user:profile:firstname:view',
            'user:profile:email:view'
        ]
    }
];
async function main() {
    const existingUsers = await index_1.default.users.findMany();
    if (existingUsers.length > 0) {
        for (const user of existingUsers) {
            await index_1.default.usersPermissions.deleteMany({
                where: {
                    userId: user.id
                }
            });
        }
        await index_1.default.users.deleteMany();
        console.log('Existing users deleted.');
    }
    for (const userData of usersData) {
        const permissions = userData.permissions.map((permission) => ({ name: permission }));
        const user = await index_1.default.users.create({
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
        console.log('User created:', user);
    }
    await index_1.default.$disconnect();
}
void main();
