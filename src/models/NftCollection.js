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
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const NftCollectionModel = sequelize.define('nftCollection', modelDefinition, modelOptions);

  NftCollectionModel.associate = (model) => {
    NftCollectionModel.belongsToMany(
      model.role,
      {
        through: 'NftCollectionRole',
      },
    );
    NftCollectionModel.hasMany(model.nft);
  };

  return NftCollectionModel;
};
