"use strict";

// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
// _t = time (for example: faucet claim too fast)
//
module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['login_s', 'login_f', 'logout_s', 'ignoreme_s', 'ignoreme_f', 'help_s', 'help_f', 'link_s', 'link_f', 'account_s', 'account_f', 'unlink_s', 'unlink_f', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'myrank_s', 'myrank_f', 'ranks_s', 'ranks_f', 'deposit_s', 'deposit_f', 'balance_s', 'balance_f', 'price_s', 'price_f', 'withdraw_s', 'withdraw_f', 'withdraw_i', 'topggvote_s', 'topggvote_f', 'userJoined_s', 'userJoined_f', 'activeTalker_s', 'activeTalker_f', 'leaderboard_s', 'leaderboard_f', 'mostActive_s', 'mostActive_f']
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    spender_balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    earner_balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    failedAmount: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }; // 2: The model options.

  var modelOptions = {
    freezeTableName: true
  }; // 3: Define the Domain model.

  var ActivityModel = sequelize.define('activity', modelDefinition, modelOptions);

  ActivityModel.associate = function (model) {
    ActivityModel.belongsTo(model.dashboardUser, {
      as: 'dashboardUser',
      foreignKey: 'dashboardUserId'
    });
    ActivityModel.belongsTo(model.user, {
      as: 'spender',
      foreignKey: 'spenderId'
    });
    ActivityModel.belongsTo(model.user, {
      as: 'earner',
      foreignKey: 'earnerId'
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'transaction',
      foreignKey: 'transactionId'
    });
    ActivityModel.belongsTo(model.topggVote, {
      as: 'topggVote',
      foreignKey: 'topggVoteId'
    });
    ActivityModel.belongsTo(model.userJoined, {
      as: 'userJoined',
      foreignKey: 'userJoinedId'
    });
    ActivityModel.belongsTo(model.activeTalker, {
      as: 'activeTalker',
      foreignKey: 'activeTalkerId'
    });
  };

  return ActivityModel;
};