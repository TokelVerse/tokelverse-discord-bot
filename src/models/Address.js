module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pubKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const AddressModel = sequelize.define('address', modelDefinition, modelOptions);

  AddressModel.associate = (model) => {
    AddressModel.belongsTo(model.wallet);
    AddressModel.hasMany(model.transaction);
  };

  return AddressModel;
};
