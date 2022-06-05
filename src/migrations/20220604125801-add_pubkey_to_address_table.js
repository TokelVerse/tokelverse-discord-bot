module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'address', // name of Target model
      'pubKey', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('address', 'pubKey');
  },
};
