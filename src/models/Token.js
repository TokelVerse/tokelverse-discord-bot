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
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const TokenModel = sequelize.define('token', modelDefinition, modelOptions);

  TokenModel.associate = (model) => {
    TokenModel.hasMany(model.wallet, {
      as: 'wallet',
    });
    TokenModel.hasMany(model.transaction, {
      as: 'transactions',
    });
  };

  return TokenModel;
};
