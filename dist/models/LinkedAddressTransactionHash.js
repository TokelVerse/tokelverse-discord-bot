"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var LinkedAddressTransactionHashModel = sequelize.define('linkedAddressTransactionHash', modelDefinition, modelOptions);

  LinkedAddressTransactionHashModel.associate = function (model) {
    LinkedAddressTransactionHashModel.belongsTo(model.linkedAddress);
  };

  return LinkedAddressTransactionHashModel;
};