module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'exp', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'exp');
  },
};
