/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  MessageButton,
  MessageActionRow,
} from "discord.js";
import {
  warnDirectMessage,
  noAddressToUnlink,
  confirmUnlinkAddress,
  timeOutUnlinkAddressMessage,
  cancelUnlinkAddress,
  successUnlinkAddress,
  cannotSendMessageUser,
  discordErrorMessage,
} from '../embeds';
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

    const noId = 'no';
    const yesId = 'yes';
    const NoButton = new MessageButton({
      style: 'SECONDARY',
      label: 'No',
      emoji: '❌',
      customId: noId,
    });
    const YesButton = new MessageButton({
      style: 'SECONDARY',
      label: 'Yes',
      emoji: '✔️',
      customId: yesId,
    });

    if (hasAddressToUnlink) {
      const embedMessage = await message.author.send({
        embeds: [
          confirmUnlinkAddress(
            message,
            hasAddressToUnlink.address,
          ),
        ],
        components: [
          new MessageActionRow({
            components: [
              YesButton,
              NoButton,
            ],
          }),
        ],
      });

      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user: discordUser }) => discordUser.id === user.user_id,
        componentType: 'BUTTON',
        max: 1,
        time: 60000,
        errors: ['time'],
      });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === yesId) {
          console.log('received yes');
          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          }, async (t) => {
            const unlinkedAddress = await hasAddressToUnlink.update({
              enabled: false,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            await interaction.update({
              embeds: [
                successUnlinkAddress(
                  message,
                  unlinkedAddress.address,
                ),
              ],
              components: [],
            });
          }).catch(async (err) => {
            try {
              await db.error.create({
                type: 'unlink',
                error: `${err}`,
              });
            } catch (e) {
              logger.error(`Error Discord: ${e}`);
            }
          });
        }
        if (interaction.customId === noId) {
          await interaction.update({
            embeds: [
              cancelUnlinkAddress(
                message,
              ),
            ],

          });
        }
      });

      collector.on('end', async (collected) => {
        console.log(collected.size);
        if (collected.size === 0) {
          await embedMessage.edit({
            embeds: [
              timeOutUnlinkAddressMessage(
                message,
              ),
            ],
            components: [],
          });
        }
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
