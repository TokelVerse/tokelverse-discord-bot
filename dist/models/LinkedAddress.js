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
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var LinkedAddressModel = sequelize.define('linkedAddress', modelDefinition, modelOptions);

  LinkedAddressModel.associate = function (model) {
    LinkedAddressModel.belongsTo(model.user);
    LinkedAddressModel.hasMany(model.linkedAddressTransactionHash);
  };

  return LinkedAddressModel;
};