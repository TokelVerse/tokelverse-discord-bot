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
      allowNull: false,
      unique: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var NftCollectionModel = sequelize.define('nftCollection', modelDefinition, modelOptions);

  NftCollectionModel.associate = function (model) {
    NftCollectionModel.belongsToMany(model.role, {
      through: 'NftCollectionRole'
    });
    NftCollectionModel.hasMany(model.nft);
  };

  return NftCollectionModel;
};