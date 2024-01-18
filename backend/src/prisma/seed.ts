import prismaClient  from './index';

const usersData = [
  {
    firstname: 'John',
    email: 'john@mailforspam.com',
    permissions: [
      'user:profile:view',
      'user:profile:firstname:view',
      'user:profile:email:view',
      'user:profile:firstname:edit',
      'user:profile:email:edit',
    ],
  },
  {
    firstname: 'Gabriela',
    email: 'gabriela@mailforspam.com',
    permissions: [
      'user:profile:view',
      'user:profile:firstname:view',
      'user:profile:email:view',
      'user:profile:email:edit',
    ],
  },
  {
    firstname: 'Fernando',
    email: 'fernando@mailforspam.com',
    permissions: [
      'user:profile:view',
      'user:profile:firstname:view',
      'user:profile:email:view',
      'user:profile:firstname:edit',
    ],
  },
  {
    firstname: 'Lais',
    email: 'lais@mailforspam.com',
    permissions: [
      'user:profile:view',
      'user:profile:firstname:view',
      'user:profile:email:view',
    ],
  },
];

async function main() {

  const existingUsers = await prismaClient.users.findMany();
  
  if (existingUsers.length > 0) {
    for (const user of existingUsers) {
        await prismaClient.usersPermissions.deleteMany({
            where: {
                userId: user.id,
            },
        });
    }
    await prismaClient.users.deleteMany();
    console.log('Existing users deleted.');
  }

  for (const userData of usersData) {
    const permissions = userData.permissions.map((permission: string) => ({ name: permission }));
    const user = await prismaClient.users.create({
      data: {
        firstname: userData.firstname,
        email: userData.email,
        permissions: {
          create: permissions.map((permissionData) => ({
            permission: { create: permissionData },
          })),
        },
      },
    });

    console.log('User created:', user);
  }
}

main()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
