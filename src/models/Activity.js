// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
// _t = time (for example: faucet claim too fast)
//
module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'login_s',
        'login_f',
        'logout_s',
        'ignoreme_s',
        'ignoreme_f',
        'help_s',
        'help_f',
        'link_s',
        'link_f',
        'account_s',
        'account_f',
        'unlink_s',
        'unlink_f',
        'depositAccepted',
        'depositComplete',
        'withdrawRequested',
        'withdrawAccepted',
        'withdrawComplete',
        'withdrawRejected',
      ],
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    spender_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    earner_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    failedAmount: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const ActivityModel = sequelize.define('activity', modelDefinition, modelOptions);

  ActivityModel.associate = (model) => {
    ActivityModel.belongsTo(model.dashboardUser, {
      as: 'dashboardUser',
      foreignKey: 'dashboardUserId',
    });
    ActivityModel.belongsTo(model.user, {
      as: 'spender',
      foreignKey: 'spenderId',
    });
    ActivityModel.belongsTo(model.user, {
      as: 'earner',
      foreignKey: 'earnerId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'transaction',
      foreignKey: 'transactionId',
    });
    ActivityModel.belongsTo(model.topggVote, {
      as: 'topggVote',
      foreignKey: 'topggVoteId',
    });
    ActivityModel.belongsTo(model.userJoined, {
      as: 'userJoined',
      foreignKey: 'userJoinedId',
    });
    ActivityModel.belongsTo(model.activeTalker, {
      as: 'activeTalker',
      foreignKey: 'activeTalkerId',
    });
  };

  return ActivityModel;
};
