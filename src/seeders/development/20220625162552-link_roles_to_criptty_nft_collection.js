module.exports = {
  up: async (queryInterface, Sequelize) => {
    const generalRole = await queryInterface.rawSelect('role', {
      where: {
        name: 'General holder',
      },
    }, ['id']);
    const cripttyRole = await queryInterface.rawSelect('role', {
      where: {
        name: 'Criptty holder',
      },
    }, ['id']);
    const criptty = await queryInterface.rawSelect('nftCollection', {
      where: {
        name: 'criptty',
      },
    }, ['id']);

    await queryInterface.bulkInsert('NftCollectionRole', [
      {
        roleId: generalRole,
        nftCollectionId: criptty,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: cripttyRole,
        nftCollectionId: criptty,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('NftCollectionRole', null, {}),
};
