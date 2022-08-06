module.exports = {
  up: async (queryInterface, Sequelize) => {
    const generalRole = await queryInterface.rawSelect('role', {
      where: {
        name: 'General holder',
      },
    }, ['id']);
    const tokelnaut = await queryInterface.rawSelect('role', {
      where: {
        name: 'Tokelnaut',
      },
    }, ['id']);
    const tokelnautfive = await queryInterface.rawSelect('role', {
      where: {
        name: 'Tokelnaut 5+',
      },
    }, ['id']);
    const tokelnautten = await queryInterface.rawSelect('role', {
      where: {
        name: 'Tokelnaut 10+',
      },
    }, ['id']);
    const tokelnauttwenty = await queryInterface.rawSelect('role', {
      where: {
        name: 'Tokelnaut 20+',
      },
    }, ['id']);
    const tokelnautCollection = await queryInterface.rawSelect('nftCollection', {
      where: {
        name: 'Tokelnauts',
      },
    }, ['id']);

    await queryInterface.bulkInsert('NftCollectionRole', [
      {
        roleId: generalRole,
        nftCollectionId: tokelnautCollection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: tokelnaut,
        nftCollectionId: tokelnautCollection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: tokelnautfive,
        nftCollectionId: tokelnautCollection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: tokelnautten,
        nftCollectionId: tokelnautCollection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: tokelnauttwenty,
        nftCollectionId: tokelnautCollection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('NftCollectionRole', null, {}),
};
