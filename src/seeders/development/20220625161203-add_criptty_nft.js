module.exports = {
  up: async (queryInterface, Sequelize) => {
    const criptty = await queryInterface.rawSelect('nftCollection', {
      where: {
        name: 'criptty',
      },
    }, ['id']);

    await queryInterface.bulkInsert('nft', [
      {
        tokenId: '9bff65e0e0d615b9410f5f39bb6c63aea5986062f71555e9acf27c9d33945a35',
        nftCollectionId: criptty,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('nft', null, {}),
};
