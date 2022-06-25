module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('NftCollectionRole', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
        },
      },
      nftCollectionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'nftCollection',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('NftCollectionRole');
  },
};
