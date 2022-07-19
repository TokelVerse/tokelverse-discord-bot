"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboardRouter = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _passport = _interopRequireDefault(require("passport"));

var _auth = require("./controllers/auth");

var _admin = require("./controllers/admin");

var _userInfo = require("./controllers/userInfo");

var _liability = require("./controllers/liability");

var _balance = require("./controllers/balance");

var _health = require("./controllers/health");

var _bots = require("./controllers/bots");

var _rank = require("./controllers/rank");

var _ip = require("./controllers/ip");

var _servers = require("./controllers/servers");

var _errors = require("./controllers/errors");

var _status = require("./controllers/status");

var _withdrawals = require("./controllers/withdrawals");

var _withdrawalAddresses = require("./controllers/withdrawalAddresses");

var _activity = require("./controllers/activity");

var _features = require("./controllers/features");

var _resetPassword = require("./controllers/resetPassword");

var _recaptcha = require("./controllers/recaptcha");

var _dashboardUsers = require("./controllers/dashboardUsers");

var _deposits = require("./controllers/deposits");

var _channels = require("./controllers/channels");

var _blockNumber = require("./controllers/blockNumber");

var _sync = require("./controllers/sync");

var _users = require("./controllers/users");

var _passport2 = _interopRequireDefault(require("./services/passport"));

var _tfa = require("./controllers/tfa");

var _user = require("./controllers/user");

// import storeIp from './helpers/storeIp';
var requireSignin = _passport["default"].authenticate('local', {
  session: true,
  failWithError: true,
  keepSessionInfo: true
});

var IsAuthenticated = function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('isauthenticated passed');
    next();
  } else {
    console.log('isAuthenticated not passed');
    res.status(401).send({
      error: 'Unauthorized'
    });
  }
};

var use = function use(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next))["catch"](next);
  };
};

var respondCountAndResult = function respondCountAndResult(req, res) {
  if (res.locals.count && res.locals.result && res.locals.result.length > 0) {
    res.json({
      count: res.locals.count,
      result: res.locals.result
    });
  } else if (res.locals.result.length < 1) {
    res.status(404).send({
      error: "No ".concat(res.locals.name, " records found")
    });
  } else {
    res.status(401).send({
      error: "ERROR"
    });
  }
};

var respondResult = function respondResult(req, res) {
  if (res.locals.result && res.locals.result.length > 0) {
    res.json({
      result: res.locals.result
    });
  } else if ((0, _typeof2["default"])(res.locals.result) === 'object' && Object.keys(res.locals.result).length > 0 && res.locals.result !== null) {
    res.json({
      result: res.locals.result
    });
  } else if (res.locals.result.length < 1) {
    res.status(404).send({
      error: "No ".concat(res.locals.name, " records found")
    });
  } else {
    res.status(401).send({
      error: "ERROR"
    });
  }
};

var dashboardRouter = function dashboardRouter(app, io, discordClient, telegramClient, matrixClient) {
  var attachResLocalsClients = function attachResLocalsClients(req, res, next) {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.matrixClient = matrixClient;
    next();
  };

  app.get('/api/health', use(_health.healthCheck), respondResult);
  app.get('/api/authenticated', function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json({
        result: {
          tfaLocked: false,
          success: false
        }
      });
    }
  }, _tfa.istfa);
  app.post('/api/signup', _recaptcha.verifyMyCaptcha, _ip.insertIp, _auth.signup);
  app.post('/api/functions/withdrawal/accept', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _ip.insertIp, attachResLocalsClients, _withdrawals.acceptWithdrawal, respondResult);
  app.post('/api/functions/withdrawal/decline', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _ip.insertIp, attachResLocalsClients, _withdrawals.declineWithdrawal, respondResult);
  app.post('/api/management/user/ban', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_users.banUser), respondResult);
  app.post('/api/management/channel/ban', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_channels.banChannel), respondResult);
  app.post('/api/management/server/ban', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_servers.banServer), respondResult);
  app.post('/api/management/feature/remove', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_features.removeFeature), respondResult);
  app.post('/api/management/feature/update', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_features.updateFeature), respondResult);
  app.post('/api/management/feature/add', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_features.addFeature), respondResult);
  app.post('/api/management/features', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_features.fetchFeatures), respondCountAndResult);
  app.post('/api/management/bot/settings/update', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_bots.updateBotSettings), respondResult);
  app.post('/api/management/bot/settings', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_bots.fetchBotSettings), respondCountAndResult);
  app.post('/api/management/ranks', use(IsAuthenticated), use(_admin.isAdmin), use(_auth.isDashboardUserBanned), use(_ip.insertIp), use(_tfa.ensuretfa), use(_rank.fetchRanks), respondCountAndResult);
  app.post('/api/management/rank/add', use(IsAuthenticated), use(_admin.isAdmin), use(_auth.isDashboardUserBanned), use(_ip.insertIp), use(_tfa.ensuretfa), use(_rank.addRank), respondResult);
  app.post('/api/management/rank/remove', use(IsAuthenticated), use(_admin.isAdmin), use(_auth.isDashboardUserBanned), use(_ip.insertIp), use(_tfa.ensuretfa), use(_rank.removeRank), respondResult);
  app.post('/api/management/rank/update', use(IsAuthenticated), use(_admin.isAdmin), use(_auth.isDashboardUserBanned), use(_ip.insertIp), use(_tfa.ensuretfa), use(_rank.updateRank), respondResult);
  app.post('/api/management/channels', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_channels.fetchChannels), respondCountAndResult);
  app.get('/api/sync/blocks', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_sync.startSyncBlocks), respondResult);
  app.get('/api/blocknumber', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_blockNumber.fetchBlockNumber), respondResult);
  app.post('/api/activity', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_activity.fetchActivity), respondCountAndResult);
  app.post('/api/deposits/patch', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_deposits.patchDeposits), respondResult);
  app.post('/api/user', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_user.fetchUser), respondResult);
  app.post('/api/management/users', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_users.fetchUsers), respondCountAndResult);
  app.post('/api/functions/withdrawals', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_withdrawals.fetchWithdrawals), respondCountAndResult);
  app.post('/api/functions/deposits', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_deposits.fetchDeposits), respondCountAndResult);
  app.post('/api/functions/errors', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_errors.fetchErrors), respondCountAndResult);
  app.post('/api/management/withdrawaladdresses', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_withdrawalAddresses.fetchWithdrawalAddresses), respondCountAndResult);
  app.post('/api/management/withdrawaladdress', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_withdrawalAddresses.fetchWithdrawalAddress), respondResult);
  app.post('/api/management/dashboardusers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_dashboardUsers.fetchDashboardUsers), respondCountAndResult);
  app.post('/api/management/servers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_servers.fetchServers), respondCountAndResult);
  app.post('/api/management/userinfo', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_userInfo.fetchUserInfo), respondResult);
  app.get('/api/status', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, use(_status.fetchNodeStatus), respondResult);
  app.get('/api/balance', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, use(_balance.fetchBalance), respondResult); // app.get(
  //   '/api/faucet/balance',
  //   IsAuthenticated,
  //   isAdmin,
  //   isDashboardUserBanned,
  //   ensuretfa,
  //   use(fetchFaucetBalance),
  //   respondResult,
  // );

  app.get('/api/liability', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, use(_liability.fetchLiability), respondResult);
  app.post('/api/signup/verify-email', _ip.insertIp, use(_auth.verifyEmail), function (req, res) {
    console.log(res.locals.error);

    if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: true
        }
      });
    }

    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }

    if (res.locals.user) {
      res.json({
        firstname: res.locals.user.firstname,
        username: res.locals.user.username
      });
    }
  });
  app.post('/api/resend-verify-code', // IsAuthenticated,
  _ip.insertIp, // rateLimiterMiddlewarePhone,
  // ensuretfa,
  // updateLastSeen,
  use(_auth.resendVerification));
  app.post('/api/signin', _recaptcha.verifyMyCaptcha, // insertIp,
  requireSignin, _auth.isDashboardUserBanned, use(_auth.signin), respondResult);
  app.post('/api/reset-password', _recaptcha.verifyMyCaptcha, use(_resetPassword.resetPassword), respondResult);
  app.post('/api/reset-password/verify', use(_resetPassword.verifyResetPassword), respondResult);
  app.post('/api/reset-password/new', use(_resetPassword.resetPasswordNew), respondResult);
  app.post('/api/2fa/enable', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  use(_tfa.enabletfa), respondResult);
  app.post('/api/2fa/disable', IsAuthenticated, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  use(_tfa.disabletfa), respondResult);
  app.post('/api/2fa/unlock', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  use(_tfa.unlocktfa), respondResult);
  app.get('/api/logout', _ip.insertIp, // storeIp,
  use(_auth.destroySession));
};

exports.dashboardRouter = dashboardRouter;