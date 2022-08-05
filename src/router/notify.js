/* eslint-disable no-restricted-syntax */
import { config } from "dotenv";
import db from '../models';

import walletNotifyTokel from '../helpers/blockchain/tokel/walletNotify';
import { startTokelSync } from "../services/syncTokel";
import { linkedAddressVerified } from '../embeds';
import { discordTopggVote } from '../controllers/topggVote';

const Topgg = require("@top-gg/sdk");

const webhook = new Topgg.Webhook(process.env.TOPGGAUTH);

// import { incomingDepositMessageHandler } from '../helpers/messageHandlers';

const localhostOnly = (
  req,
  res,
  next,
) => {
  const hostmachine = req.headers.host.split(':')[0];
  if (
    hostmachine !== 'localhost'
    && hostmachine !== '127.0.0.1'
  ) {
    return res.sendStatus(401);
  }
  next();
};

export const notifyRouter = (
  app,
  discordClient,
  io,
  queue,
) => {
  app.post(
    '/api/rpc/blocknotify',
    localhostOnly,
    (req, res) => {
      startTokelSync(
        discordClient,
        io,
        queue,
      );
      res.sendStatus(200);
    },
  );

  app.post(
    '/api/rpc/walletnotify',
    localhostOnly,
    async (req, res, next) => {
      if (req.body.ticker === 'TKL') {
        walletNotifyTokel(req, res, next);
      }
    },
    async (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
      } else if (!res.locals.error
        && res.locals.detail
        && res.locals.detail.length > 0
      ) {
        for await (const detail of res.locals.detail) {
          if (detail.amount) {
            // await incomingDepositMessageHandler(
            //   discordClient,
            //   detail,
            // );
          }
        }
      }
      if (
        res.locals.verifyAddress
        && Object.keys(res.locals.verifyAddress).length > 0
      ) {
        const myClient = await discordClient.users.fetch(res.locals.verifyAddress.discordId, false);
        await myClient.send({
          embeds: [
            linkedAddressVerified(
              res.locals.verifyAddress.discordId,
              res.locals.verifyAddress.linkedAddress,
            ),
          ],
        });
      }
      if (res.locals.activity) {
        try {
          io.to('admin').emit('updateActivity', {
            activity: res.locals.activity,
          });
        } catch (e) {
          console.log(e);
        }
      }
      res.sendStatus(200);
    },
  );

  app.post("/api/vote/topgg", webhook.listener(async (vote) => {
    console.log(vote);
    const isOurGuild = await db.setting.findOne({
      where: {
        discordHomeServerGuildId: vote.guild,
      },
    });
    if (
      isOurGuild
      && vote.type === 'upvote'
    ) {
      await queue.add(async () => {
        const task = await discordTopggVote(
          discordClient,
          vote,
          io,
        );
      });
    }
  }));
};
