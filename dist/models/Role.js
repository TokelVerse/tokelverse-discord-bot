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
    },
    discordRoleId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var RoleModel = sequelize.define('role', modelDefinition, modelOptions);

  RoleModel.associate = function (model) {
    RoleModel.belongsToMany(model.nftCollection, {
      through: 'NftCollectionRole'
    });
    RoleModel.belongsToMany(model.user, {
      through: 'NftCollectionRole'
    });
  };

  return RoleModel;
};