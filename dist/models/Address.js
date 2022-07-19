"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pubKey: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var AddressModel = sequelize.define('address', modelDefinition, modelOptions);

  AddressModel.associate = function (model) {
    AddressModel.belongsTo(model.wallet);
    AddressModel.hasMany(model.transaction);
  };

  return AddressModel;
};