"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var NftModel = sequelize.define('nft', modelDefinition, modelOptions);

  NftModel.associate = function (model) {
    NftModel.belongsTo(model.nftCollection);
    NftModel.belongsTo(model.user);
  };

  return NftModel;
};