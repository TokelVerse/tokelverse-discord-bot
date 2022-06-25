module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('role', [
      {
        name: 'General holder',
        discordRoleId: '990289386044264508',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Criptty holder',
        discordRoleId: '978658959453986896',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('role', null, {}),
};
