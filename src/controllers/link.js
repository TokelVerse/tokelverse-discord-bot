/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ChannelType,
  InteractionType,
} from 'discord.js';
import {
  warnDirectMessage,
  enterAddressToLinkMessage,
  invalidTokelLinkAddress,
  addedNewTokelLinkAddress,
  tokelLinkAddressAlreadyOccupied,
  tokelLinkAddressAlreadyVerified,
  tokelLinkAddressAlreadyBusyVerifying,
  cannotSendMessageUser,
  discordErrorMessage,
  timeOutTokelLinkAddressMessage,
  userAlreadyLinkedAnAddressMessage,
} from '../embeds';
import db from '../models';
import logger from "../helpers/logger";
import { userWalletExist } from "../helpers/client/userWalletExist";
import { getInstance } from "../services/rclient";
import { fetchDiscordChannel } from "../helpers/client/fetchDiscordChannel";
import { fetchDiscordUserIdFromMessageOrInteraction } from "../helpers/client/fetchDiscordUserIdFromMessageOrInteraction";

export const discordLinkAddress = async (
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
      'link',
      t,
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const discordUserId = user.user_id.replace('discord-', '');

    if (message.channel.type === ChannelType.GuildText) {
      console.log('before warn direct message');
      await discordChannel.send({
        embeds: [
          warnDirectMessage(
            discordUserId,
            'Link Tokel Address',
          ),
        ],
      });
    }
    const userAlreadyLinkedAnAddress = await db.linkedAddress.findOne({
      where: {
        userId: user.id,
        enabled: true,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (userAlreadyLinkedAnAddress) {
      await discordUserDMChannel.send({
        embeds: [
          userAlreadyLinkedAnAddressMessage(
            user,
            userAlreadyLinkedAnAddress.address,
          ),
        ],
      });
      return;
    }

    await discordUserDMChannel.send({
      embeds: [
        enterAddressToLinkMessage(),
      ],
    });

    const msgFilter = (m) => {
      const filtered = m.author.id === discordUserId;
      return filtered;
    };

    await discordUserDMChannel.awaitMessages({
      filter: msgFilter,
      max: 1,
      time: 60000,
      errors: ['time'],
    }).then(async (collected) => {
      const collectedMessage = collected.first();
      console.log(collectedMessage.content);
      console.log('collectedMessage.content');
      let isValidAddress;
      try {
        isValidAddress = await getInstance().validateAddress(collectedMessage.content);
      } catch (e) {
        console.log(e);
        isValidAddress = false;
      }
      console.log(isValidAddress);
      if (isValidAddress && isValidAddress.isvalid) {
        const isAlreadyOccupied = await db.linkedAddress.findOne({
          where: {
            address: collectedMessage.content,
            verified: true,
            enabled: true,
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (isAlreadyOccupied) {
          await discordUserDMChannel.send({
            embeds: [
              tokelLinkAddressAlreadyOccupied(
                message,
                collectedMessage.content,
              ),
            ],
          });
        } else {
          const linkedAddressDB = await db.linkedAddress.findOne({
            where: {
              userId: user.id,
              address: collectedMessage.content,
            },
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          if (
            linkedAddressDB
            && linkedAddressDB.verified
            && linkedAddressDB.enabled
          ) {
            await discordUserDMChannel.send({
              embeds: [
                tokelLinkAddressAlreadyVerified(
                  message,
                  collectedMessage.content,
                ),
              ],
            });
          } else if (
            linkedAddressDB
            && linkedAddressDB.enabled
            && !linkedAddressDB.verified
          ) {
            console.log('4');
            await discordUserDMChannel.send({
              embeds: [
                tokelLinkAddressAlreadyBusyVerifying(
                  message,
                  linkedAddressDB.address,
                ),
              ],
            });
          } else {
            if (
              linkedAddressDB
              && !linkedAddressDB.enabled
            ) {
              console.log('5');
              await linkedAddressDB.update({
                enabled: true,
                verified: false,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              console.log('6');
            } else {
              const createLinkedAddress = await db.linkedAddress.create({
                address: collectedMessage.content,
                userId: user.id,
                verified: false,
                enabled: true,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
            }
            console.log('before addedTokenLink');
            console.log(user);
            console.log(user.wallet);
            console.log(user.wallet.address);

            await discordUserDMChannel.send({
              embeds: [
                addedNewTokelLinkAddress(
                  message,
                  collectedMessage.content,
                  user.wallet.address.address,
                ),
              ],
            });
          }
        }
      } else {
        await discordUserDMChannel.send({
          embeds: [
            invalidTokelLinkAddress(
              message,
            ),
          ],
        });
      }
    }).catch(async (collected) => {
      console.log(collected);
      await discordUserDMChannel.send({
        embeds: [
          timeOutTokelLinkAddressMessage(
            message,
          ),
        ],
      });
    });

    const preActivity = await db.activity.create({
      type: 'link_s',
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
        type: 'link',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    const userId = await fetchDiscordUserIdFromMessageOrInteraction(
      message,
    );
    if (err.code && err.code === 50007) {
      await discordChannel.send({
        embeds: [
          cannotSendMessageUser(
            "Link",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await discordChannel.send({
        embeds: [
          discordErrorMessage(
            "Link",
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
