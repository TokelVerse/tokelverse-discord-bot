module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('nft', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      nftCollectionId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'nftCollection', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      userId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'user', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('nft');
  },
};
