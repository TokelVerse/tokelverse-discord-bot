/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ChannelType,
  InteractionType,
} from 'discord.js';
import {
  warnDirectMessage,
  helpMessage,
  cannotSendMessageUser,
  discordErrorMessage,
} from '../embeds';
import db from '../models';
import logger from "../helpers/logger";
import { userWalletExist } from "../helpers/client/userWalletExist";
import { fetchDiscordChannel } from "../helpers/client/fetchDiscordChannel";
import { fetchDiscordUserIdFromMessageOrInteraction } from "../helpers/client/fetchDiscordUserIdFromMessageOrInteraction";

export const discordHelp = async (
  discordClient,
  message,
  io,
) => {
  const activity = [];

  const [
    discordChannel,
    discordUserDMChannel,
  ] = await fetchDiscordChannel(
    discordClient,
    message,
  );

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      'help',
      t,
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const discordUserId = user.user_id.replace('discord-', '');

    if (message.channel.type === ChannelType.DM) {
      await discordUserDMChannel.send({
        embeds: [
          helpMessage(),
        ],
      });
    }
    if (message.channel.type === ChannelType.GuildText) {
      await discordUserDMChannel.send({
        embeds: [
          helpMessage(),
        ],
      });
      await discordChannel.send({
        embeds: [
          warnDirectMessage(
            discordUserId,
            'Help',
          ),
        ],
      });
    }

    const preActivity = await db.activity.create({
      type: 'help_s',
      earnerId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const finalActivity = await db.activity.findOne({
      where: {
        id: preActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'earner',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(finalActivity);
  }).catch(async (err) => {
    const userId = await fetchDiscordUserIdFromMessageOrInteraction(
      message,
    );

    try {
      await db.error.create({
        type: 'help',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    if (err.code && err.code === 50007) {
      await discordChannel.send({
        embeds: [
          cannotSendMessageUser(
            "Help",
            userId,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await discordChannel.send({
        embeds: [
          discordErrorMessage(
            "Help",
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    }
  });

  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
