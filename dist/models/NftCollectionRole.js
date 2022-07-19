"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Wallet model.

  var RoleNftCollectionModel = sequelize.define('NftCollectionRole', modelDefinition, modelOptions);

  RoleNftCollectionModel.associate = function (model) {};

  return RoleNftCollectionModel;
};