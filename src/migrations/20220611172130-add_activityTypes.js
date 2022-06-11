// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
//
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        type: DataTypes.ENUM(
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
          'myrank_s',
          'myrank_f',
          'ranks_s',
          'ranks_f',
          'deposit_s',
          'deposit_f',
          'balance_s',
          'balance_f',
          'price_s',
          'price_f',
          'withdraw_s',
          'withdraw_f',
          'withdraw_i',
          'topggvote_s',
          'topggvote_f',
          'userJoined_s',
          'userJoined_f',
          'activeTalker_s',
          'activeTalker_f',
          'leaderboard_s',
          'leaderboard_f',
          'mostActive_s',
          'mostActive_f',
        ),
      });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        type: DataTypes.ENUM(
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
        ),
      });
  },
};
