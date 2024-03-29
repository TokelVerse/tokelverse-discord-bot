/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ActionRowBuilder,
  ChannelType,
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
import {
  generateNoButton,
  generateYesButton,
} from '../buttons';
import { fetchDiscordChannel } from "../helpers/client/fetchDiscordChannel";
import { fetchDiscordUserIdFromMessageOrInteraction } from "../helpers/client/fetchDiscordUserIdFromMessageOrInteraction";

export const discordUnlinkAddress = async (
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
      'unlink',
      t,
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const discordUserId = user.user_id.replace('discord-', '');

    console.log(1);
    if (message.channel.type === ChannelType.GuildText) {
      await discordChannel.send({
        embeds: [
          warnDirectMessage(
            discordUserId,
            'Unlink Tokel Address',
          ),
        ],
      });
    }
    console.log(2);
    const hasAddressToUnlink = await db.linkedAddress.findOne({
      where: {
        enabled: true,
        userId: user.id,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    console.log(3);
    if (!hasAddressToUnlink) {
      await discordUserDMChannel.send({
        embeds: [
          noAddressToUnlink(
            discordUserId,
          ),
        ],
      });
    }

    console.log(4);
    console.log(hasAddressToUnlink);

    if (hasAddressToUnlink) {
      const embedMessage = await discordUserDMChannel.send({
        embeds: [
          confirmUnlinkAddress(
            discordUserId,
            hasAddressToUnlink.address,
          ),
        ],
        components: [
          new ActionRowBuilder({
            components: [
              await generateYesButton(),
              await generateNoButton(),
            ],
          }),
        ],
      });
      console.log(6);
      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user: discordUser }) => discordUser.id === user.user_id,
        // componentType: 'BUTTON',
        max: 1,
        time: 60000,
        errors: ['time'],
      });
      console.log(7);
      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'yes') {
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
                  discordUserId,
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
        if (interaction.customId === 'no') {
          await interaction.update({
            embeds: [
              cancelUnlinkAddress(
                discordUserId,
              ),
            ],
            components: [],
          });
        }
      });

      collector.on('end', async (collected) => {
        console.log(collected.size);
        if (collected.size === 0) {
          await embedMessage.edit({
            embeds: [
              timeOutUnlinkAddressMessage(
                discordUserId,
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
    const userId = await fetchDiscordUserIdFromMessageOrInteraction(
      message,
    );

    if (err.code && err.code === 50007) {
      await discordChannel.send({
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
      await discordChannel.send({
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
