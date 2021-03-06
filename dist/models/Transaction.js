"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['receive', 'send']
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    feeAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    confirmations: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    phase: {
      type: DataTypes.ENUM,
      values: ['review', 'pending', 'confirming', 'confirmed', 'rejected', 'failed']
    },
    to_from: {
      type: DataTypes.STRING,
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var TransactionModel = sequelize.define('transaction', modelDefinition, modelOptions);

  TransactionModel.associate = function (model) {
    TransactionModel.hasMany(model.activity, {
      as: 'transaction'
    });
    TransactionModel.belongsTo(model.address, {
      as: 'address'
    });
    TransactionModel.belongsTo(model.block, {
      as: 'block'
    });
    TransactionModel.belongsTo(model.user);
    TransactionModel.belongsTo(model.addressExternal);
    TransactionModel.belongsTo(model.wallet);
  };

  return TransactionModel;
};