module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const NftModel = sequelize.define('nft', modelDefinition, modelOptions);

  NftModel.associate = (model) => {
    NftModel.belongsTo(model.nftCollection);
    NftModel.belongsTo(model.user);
  };

  return NftModel;
};
