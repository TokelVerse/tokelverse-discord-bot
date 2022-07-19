"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var TokenModel = sequelize.define('token', modelDefinition, modelOptions);

  TokenModel.associate = function (model) {
    TokenModel.hasMany(model.wallet, {
      as: 'wallet'
    });
    TokenModel.hasMany(model.transaction, {
      as: 'transactions'
    });
  };

  return TokenModel;
};