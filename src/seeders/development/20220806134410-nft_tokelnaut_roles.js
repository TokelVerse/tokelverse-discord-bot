module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('role', [
      {
        name: 'Tokelnaut',
        discordRoleId: '1005467029664444526',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tokelnaut 5+',
        discordRoleId: '1005467073637527642',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tokelnaut 10+',
        discordRoleId: '1001960169246298261',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tokelnaut 20+',
        discordRoleId: '1005467109628837908',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('role', null, {}),
};
