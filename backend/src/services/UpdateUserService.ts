import prismaClient from "../prisma";

class UpdateUserService {
    async execute(id: string, email?: string, firstname?: string) {
        if (!id) {
            throw new Error("User id is required!");
        }

        const findUser = await prismaClient.users.findFirst({
            where: { id },
        });

        if (!findUser) {
            throw new Error("User not found!");
        }

        const findPermissions = await prismaClient.permissions.findMany({
            where: {
                usersPermissions: {
                    some: {
                        userId: id,
                    },
                },
            },
            select: { name: true },
        });

        if (!findPermissions || findPermissions.length === 0) {
            throw new Error("User has no permissions to edit.");
        }

        if (email && firstname && findPermissions.some(permission => permission.name === "user:profile:email:edit") && findPermissions.some(permission => permission.name === "user:profile:firstname:edit")) {

            const updatedUser = await prismaClient.users.update({
                where: { id },
                data: { firstname, email },
                select: { firstname: true, email: true },
            });
            
            return updatedUser;
        };

        if (email && findPermissions.some(permission => permission.name === "user:profile:email:edit")) {
            
            if (firstname !== findUser.firstname) {
                throw new Error("Permission denied to edit firstname.");
            }

            const updatedUser = await prismaClient.users.update({
                where: { id },
                data: { email },
                select: { firstname: true, email: true },
            });
            
            return updatedUser;
        };
        
        if (firstname && findPermissions.some(permission => permission.name === "user:profile:firstname:edit")) {

            if (email !== findUser.email) {
                throw new Error("Permission denied to edit email.");
            }

            const updateUser = await prismaClient.users.update({
                where: { id },
                data: { firstname },
                select: { firstname: true, email: true },
            });
            return updateUser;
        }


        throw new Error("User does not have the required permissions for the update.");
    }
}

export { UpdateUserService };