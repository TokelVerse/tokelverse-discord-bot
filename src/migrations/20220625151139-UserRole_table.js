module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('UserRole', {
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
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
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
    await queryInterface.dropTable('UserRole');
  },
};
