import passport from 'passport';
import {
  signin,
  signup,
  verifyEmail,
  resendVerification,
  destroySession,
  isDashboardUserBanned,
} from './controllers/auth';

import { isAdmin } from './controllers/admin';
import { fetchUserInfo } from './controllers/userInfo';
import { fetchLiability } from './controllers/liability';
import { fetchBalance } from './controllers/balance';
import { healthCheck } from './controllers/health';
import {
  fetchBotSettings,
  updateBotSettings,
} from './controllers/bots';
import {
  fetchRanks,
  addRank,
  removeRank,
  updateRank,
} from './controllers/rank';

import { insertIp } from './controllers/ip';

import {
  fetchServers,
  banServer,
} from './controllers/servers';

import {
  fetchErrors,
} from './controllers/errors';

import { fetchNodeStatus } from './controllers/status';

import {
  fetchWithdrawals,
  acceptWithdrawal,
  declineWithdrawal,
} from './controllers/withdrawals';

import {
  fetchWithdrawalAddress,
  fetchWithdrawalAddresses,
} from './controllers/withdrawalAddresses';
import { fetchActivity } from './controllers/activity';
import {
  fetchFeatures,
  addFeature,
  removeFeature,
  updateFeature,
} from './controllers/features';

import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import { verifyMyCaptcha } from './controllers/recaptcha';

import {
  fetchDashboardUsers,
} from './controllers/dashboardUsers';

import {
  fetchDeposits,
  patchDeposits,
} from './controllers/deposits';

import {
  fetchChannels,
  banChannel,
} from './controllers/channels';

import {
  fetchBlockNumber,
} from './controllers/blockNumber';

import {
  startSyncBlocks,
} from './controllers/sync';

import {
  fetchUsers,
  banUser,
} from './controllers/users';
import passportService from './services/passport';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';

import {
  fetchUser,
} from './controllers/user';

// import storeIp from './helpers/storeIp';

const requireSignin = passport.authenticate('local', {
  session: true,
  failWithError: true,
  keepSessionInfo: true,
});

const IsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauthenticated passed');
    next();
  } else {
    console.log('isAuthenticated not passed');
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const respondCountAndResult = (req, res) => {
  if (
    res.locals.count
    && res.locals.result
    && res.locals.result.length > 0
  ) {
    res.json({
      count: res.locals.count,
      result: res.locals.result,
    });
  } else if (
    res.locals.result.length < 1
  ) {
    res.status(404).send({
      error: `No ${res.locals.name} records found`,
    });
  } else {
    res.status(401).send({
      error: "ERROR",
    });
  }
};

const respondResult = (req, res) => {
  if (
    res.locals.result
    && res.locals.result.length > 0
  ) {
    res.json({
      result: res.locals.result,
    });
  } else if (
    typeof res.locals.result === 'object'
    && Object.keys(res.locals.result).length > 0
    && res.locals.result !== null
  ) {
    res.json({
      result: res.locals.result,
    });
  } else if (
    res.locals.result.length < 1
  ) {
    res.status(404).send({
      error: `No ${res.locals.name} records found`,
    });
  } else {
    res.status(401).send({
      error: "ERROR",
    });
  }
};

export const dashboardRouter = (
  app,
  io,
  discordClient,
  telegramClient,
  matrixClient,
) => {
  const attachResLocalsClients = (req, res, next) => {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.matrixClient = matrixClient;
    next();
  };

  app.get(
    '/api/health',
    use(healthCheck),
    respondResult,
  );

  app.get(
    '/api/authenticated',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.json({
          result: {
            tfaLocked: false,
            success: false,
          },
        });
      }
    },
    istfa,
  );

  app.post(
    '/api/signup',
    verifyMyCaptcha,
    insertIp,
    signup,
  );

  app.post(
    '/api/functions/withdrawal/accept',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    attachResLocalsClients,
    acceptWithdrawal,
    respondResult,
  );

  app.post(
    '/api/functions/withdrawal/decline',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    attachResLocalsClients,
    declineWithdrawal,
    respondResult,
  );

  app.post(
    '/api/management/user/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banUser),
    respondResult,
  );

  app.post(
    '/api/management/channel/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banChannel),
    respondResult,
  );

  app.post(
    '/api/management/server/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banServer),
    respondResult,
  );

  app.post(
    '/api/management/feature/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(removeFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updateFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/add',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(addFeature),
    respondResult,
  );

  app.post(
    '/api/management/features',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchFeatures),
    respondCountAndResult,
  );

  app.post(
    '/api/management/bot/settings/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updateBotSettings),
    respondResult,
  );

  app.post(
    '/api/management/bot/settings',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchBotSettings),
    respondCountAndResult,
  );

  app.post(
    '/api/management/ranks',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchRanks),
    respondCountAndResult,
  );
  app.post(
    '/api/management/rank/add',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(addRank),
    respondResult,
  );

  app.post(
    '/api/management/rank/remove',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(removeRank),
    respondResult,
  );

  app.post(
    '/api/management/rank/update',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(updateRank),
    respondResult,
  );

  app.post(
    '/api/management/channels',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchChannels),
    respondCountAndResult,
  );

  app.get(
    '/api/sync/blocks',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(startSyncBlocks),
    respondResult,
  );

  app.get(
    '/api/blocknumber',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchBlockNumber),
    respondResult,
  );

  app.post(
    '/api/activity',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchActivity),
    respondCountAndResult,
  );

  app.post(
    '/api/deposits/patch',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(patchDeposits),
    respondResult,
  );

  app.post(
    '/api/user',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUser),
    respondResult,
  );

  app.post(
    '/api/management/users',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/withdrawals',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawals),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/deposits',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchDeposits),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/errors',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchErrors),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdresses',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddresses),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdress',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddress),
    respondResult,
  );

  app.post(
    '/api/management/dashboardusers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchDashboardUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/servers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchServers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/userinfo',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUserInfo),
    respondResult,
  );

  app.get(
    '/api/status',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchNodeStatus),
    respondResult,
  );

  app.get(
    '/api/balance',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    use(fetchBalance),
    respondResult,
  );

  // app.get(
  //   '/api/faucet/balance',
  //   IsAuthenticated,
  //   isAdmin,
  //   isDashboardUserBanned,
  //   ensuretfa,
  //   use(fetchFaucetBalance),
  //   respondResult,
  // );

  app.get(
    '/api/liability',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    use(fetchLiability),
    respondResult,
  );

  app.post(
    '/api/signup/verify-email',
    insertIp,
    use(verifyEmail),
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: true,
          },
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.user) {
        res.json({
          firstname: res.locals.user.firstname,
          username: res.locals.user.username,
        });
      }
    },
  );

  app.post(
    '/api/resend-verify-code',
    // IsAuthenticated,
    insertIp,
    // rateLimiterMiddlewarePhone,
    // ensuretfa,
    // updateLastSeen,
    use(resendVerification),
  );

  app.post(
    '/api/signin',
    verifyMyCaptcha,
    // insertIp,
    requireSignin,
    isDashboardUserBanned,
    use(signin),
    respondResult,
  );

  app.post(
    '/api/reset-password',
    verifyMyCaptcha,
    use(resetPassword),
    respondResult,
  );

  app.post(
    '/api/reset-password/verify',
    use(verifyResetPassword),
    respondResult,
  );

  app.post(
    '/api/reset-password/new',
    use(resetPasswordNew),
    respondResult,
  );

  app.post(
    '/api/2fa/enable',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    use(enabletfa),
    respondResult,
  );

  app.post(
    '/api/2fa/disable',
    IsAuthenticated,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    use(disabletfa),
    respondResult,
  );

  app.post(
    '/api/2fa/unlock',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    use(unlocktfa),
    respondResult,
  );

  app.get(
    '/api/logout',
    insertIp,
    // storeIp,
    use(destroySession),
  );
};
