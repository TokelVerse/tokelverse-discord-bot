/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
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
} from '../messages';
import db from '../models';
import logger from "../helpers/logger";
import { userWalletExist } from "../helpers/client/userWalletExist";
import { getInstance } from "../services/rclient";

export const discordLinkAddress = async (
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
      'link',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;
    console.log(user.wallet);

    if (message.channel.type === 'GUILD_TEXT') {
      await message.channel.send({
        embeds: [
          warnDirectMessage(
            message.author.id,
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
      await message.author.send({
        embeds: [
          userAlreadyLinkedAnAddressMessage(
            user,
            userAlreadyLinkedAnAddress.address,
          ),
        ],
      });
      return;
    }

    await message.author.send({
      embeds: [
        enterAddressToLinkMessage(),
      ],
    });

    const msgFilter = (m) => {
      const filtered = m.author.id === message.author.id;
      return filtered;
    };

    await message.author.dmChannel.awaitMessages({
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
          await message.author.send({
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
            await message.author.send({
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
            await message.author.send({
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

            await message.author.send({
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
        await message.author.send({
          embeds: [
            invalidTokelLinkAddress(
              message,
            ),
          ],
        });
      }
    }).catch(async (collected) => {
      console.log(collected);
      await message.author.send({
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
    logger.error(`Error Discord Link Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
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
      await message.channel.send({
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
