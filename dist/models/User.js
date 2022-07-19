"use strict";

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    ignoreMe: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    exp: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false
    },
    totalInvitedUsersCount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false
    }
  };
  var modelOptions = {
    freezeTableName: true
  };
  var UserModel = sequelize.define('user', modelDefinition, modelOptions);

  UserModel.associate = function (model) {
    UserModel.hasOne(model.wallet);
    UserModel.hasMany(model.transaction);
    UserModel.hasOne(model.linkedAddress);
    UserModel.hasMany(model.active);
    UserModel.hasMany(model.topggVote);
    UserModel.hasMany(model.activeTalker);
    UserModel.hasMany(model.nft);
    UserModel.belongsToMany(model.rank, {
      through: 'UserRank'
    });
    UserModel.belongsToMany(model.role, {
      through: 'UserRole'
    });
  };

  return UserModel;
};