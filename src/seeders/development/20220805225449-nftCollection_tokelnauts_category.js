module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('nftCollection', [
      {
        name: 'tokelnauts',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('nftCollection', null, {}),
};
