module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
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
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const LinkedAddressTransactionHashModel = sequelize.define('linkedAddressTransactionHash', modelDefinition, modelOptions);

  LinkedAddressTransactionHashModel.associate = (model) => {
    LinkedAddressTransactionHashModel.belongsTo(model.linkedAddress);
  };

  return LinkedAddressTransactionHashModel;
};
