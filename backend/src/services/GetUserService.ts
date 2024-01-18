import prismaClient from "../prisma";

class GetUserService {

    async execute(email: string) {
        if (!email) {
            throw new Error("User email are required!");
        }

        const user = await prismaClient.users.findFirst({
            where: { email },
            select: {
                firstname: true,
                email: true,
                permissions: {
                    select: {
                        permission: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        if (!user) throw new Error('User not found, please enter a valid email');

        const formattedUser = {
            user: {
                firstname: user?.firstname,
                email: user?.email,
            },
            permissions: user?.permissions.map(permission => permission.permission.name),
        };
        
        return formattedUser;
    };
}

export { GetUserService };