module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('linkedAddressTransactionHash', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkedAddressId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'linkedAddress',
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
    await queryInterface.dropTable('linkedAddressTransactionHash');
  },
};
