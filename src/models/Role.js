module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    discordRoleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const RoleModel = sequelize.define('role', modelDefinition, modelOptions);

  RoleModel.associate = (model) => {
    RoleModel.belongsToMany(
      model.nftCollection,
      {
        through: 'NftCollectionRole',
      },
    );
    RoleModel.belongsToMany(
      model.user,
      {
        through: 'NftCollectionRole',
      },
    );
  };

  return RoleModel;
};
