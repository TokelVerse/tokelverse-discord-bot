/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  noAddressToUnlink,
  confirmUnlinkAddress,
  timeOutUnlinkAddressMessage,
  cancelUnlinkAddress,
  successUnlinkAddress,
  cannotSendMessageUser,
  discordErrorMessage,
} from '../messages';
import db from '../models';
import logger from "../helpers/logger";
import { userWalletExist } from "../helpers/client/userWalletExist";

export const discordUnlinkAddress = async (
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      'unlink',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    if (message.channel.type === 'GUILD_TEXT') {
      await message.channel.send({
        embeds: [
          warnDirectMessage(
            message.author.id,
            'Unlink Tokel Address',
          ),
        ],
      });
    }

    const hasAddressToUnlink = await db.linkedAddress.findOne({
      where: {
        enabled: true,
        userId: user.id,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!hasAddressToUnlink) {
      await message.author.send({
        embeds: [
          noAddressToUnlink(
            message,
          ),
        ],
      });
    }
    if (hasAddressToUnlink) {
      await message.author.send({
        embeds: [
          confirmUnlinkAddress(
            message,
            hasAddressToUnlink.address,
          ),
        ],
      });
      const msgFilter = (m) => {
        const filtered = m.author.id === message.author.id
          && (
            m.content.toUpperCase() === 'YES'
            || m.content.toUpperCase() === 'Y'
            || m.content.toUpperCase() === 'NO'
            || m.content.toUpperCase() === 'N'
          );
        return filtered;
      };
      await message.author.dmChannel.awaitMessages({
        filter: msgFilter,
        max: 1,
        time: 60000,
        errors: ['time'],
      }).then(async (collected) => {
        const collectedMessage = collected.first();
        if (
          collectedMessage.content.toUpperCase() === 'YES'
          || collectedMessage.content.toUpperCase() === 'Y'
        ) {
          const unlinkedAddress = await hasAddressToUnlink.update({
            enabled: false,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          await message.author.send({
            embeds: [
              successUnlinkAddress(
                message,
                unlinkedAddress.address,
              ),
            ],
          });
        } else {
          await message.author.send({
            embeds: [
              cancelUnlinkAddress(
                message,
              ),
            ],
          });
        }
      }).catch(async (collected) => {
        await message.author.send({
          embeds: [
            timeOutUnlinkAddressMessage(
              message,
            ),
          ],
        });
      });
    }

    const preActivity = await db.activity.create({
      type: 'unlink_s',
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
    try {
      await db.error.create({
        type: 'unlink',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`Error Discord Link Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Unlink",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            "Unlink",
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
