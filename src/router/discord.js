import { config } from "dotenv";
import { updateDiscordChannel } from '../controllers/channel';
import { updateDiscordGroup } from '../controllers/group';
import { discordHelp } from '../controllers/help';
import { discordLinkAddress } from '../controllers/link';
import { discordUnlinkAddress } from '../controllers/unlink';
import { discordActiveTalker } from '../controllers/activeTalker';
import { discordUserJoined } from '../controllers/userJoined';
import { discordLeaderboard } from '../controllers/leaderboard';
import { discordMostActive } from "../controllers/mostActive";
import { discordMyRank } from '../controllers/myrank';
import { discordRanks } from '../controllers/ranks';
import db from "../models";

import { discordAccount } from '../controllers/account';

import { createUpdateDiscordUser, updateDiscordLastSeen } from '../controllers/user';
import { myRateLimiter } from '../helpers/rateLimit';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';
import settings from '../config/settings';

import {
  discordUserBannedMessage,
  discordServerBannedMessage,
  discordChannelBannedMessage,
} from '../messages';

config();

export const discordRouter = (
  discordClient,
  queue,
  io,
) => {
  const userInvites = {};

  discordClient.on('ready', async () => {
    const setting = await db.setting.findOne();
    discordClient.guilds.cache.each((guild) => {
      if (guild.id === setting.discordHomeServerGuildId) {
        guild.invites.fetch().then((guildInvites) => {
          guildInvites.each((guildInvite) => {
            userInvites[guildInvite.code] = guildInvite.uses;
          });
        });
      }
    });
  });

  discordClient.on('inviteCreate', (invite) => {
    userInvites[invite.code] = invite.uses;
  });

  discordClient.on('guildMemberAdd', async (member) => {
    const setting = await db.setting.findOne();

    if (member.guild.id === setting.discordHomeServerGuildId) {
      console.log(member.user);
      const newUser = await createUpdateDiscordUser(
        discordClient,
        member.user,
        queue,
      );
      member.guild.invites.fetch().then((guildInvites) => { // get all guild invites
        guildInvites.each(async (invite) => { // basically a for loop over the invites
          if (invite.uses !== userInvites[invite.code]) { // if it doesn't match what we stored:
            await queue.add(async () => {
              const findUserJoinedRecord = await db.userJoined.findOne({
                where: {
                  userJoinedId: newUser.id,
                },
              });
              if (!findUserJoinedRecord) {
                const inviter = await db.user.findOne({
                  where: {
                    user_id: invite.inviter.id,
                  },
                });
                if (inviter) {
                  const newUserJoinedRecord = await db.userJoined.create({
                    userJoinedId: newUser.id,
                    userInvitedById: inviter.id,
                  });
                }
              }
            });
          }
        });
      });
    }
  });

  discordClient.on('guildMemberUpdate', async (
    oldMember,
    newMember,
  ) => {
    const setting = await db.setting.findOne();
    const newHas = newMember.roles.cache.has(setting.joinedRoleId);
    if (newHas) {
      // Role has been added
      await queue.add(async () => {
        const task = await discordUserJoined(
          discordClient,
          newMember,
          io,
        );
      });
    }
  });

  discordClient.on('voiceStateUpdate', async (oldMember, newMember) => {
    await queue.add(async () => {
      const groupTask = await updateDiscordGroup(discordClient, newMember);
      const channelTask = await updateDiscordChannel(newMember, groupTask);
    });
  });

  discordClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand() && !interaction.isButton()) return;
    let groupTask;
    let groupTaskId;
    let channelTask;
    let channelTaskId;
    let lastSeenDiscordTask;
    if (!interaction.user.bot) {
      const maintenance = await isMaintenanceOrDisabled(
        interaction,
        'discord',
      );
      if (maintenance.maintenance || !maintenance.enabled) return;
      const walletExists = await createUpdateDiscordUser(
        discordClient,
        interaction.user,
        queue,
      );
      await queue.add(async () => {
        groupTask = await updateDiscordGroup(discordClient, interaction);
        channelTask = await updateDiscordChannel(interaction, groupTask);
        lastSeenDiscordTask = await updateDiscordLastSeen(
          interaction,
          interaction.user,
        );
        groupTaskId = groupTask && groupTask.id;
        channelTaskId = channelTask && channelTask.id;
      });
      if (interaction.isCommand()) {
        const { commandName } = interaction;
        if (commandName === 'help') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Help',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }

          await queue.add(async () => {
            console.log(interaction);
            const task = await discordHelp(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }
        if (commandName === 'myrank') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Myrank',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }

          await queue.add(async () => {
            const task = await discordMyRank(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }
        if (commandName === 'ranks') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Ranks',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }
          await queue.add(async () => {
            const task = await discordRanks(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }
        if (commandName === 'deposit') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Deposit',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }
          await queue.add(async () => {
            const task = await discordDeposit(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }
        if (commandName === 'balance') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Balance',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }
          await queue.add(async () => {
            const task = await discordBalance(
              discordClient,
              interaction,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }

        if (commandName === 'leaderboard') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'Leaderboard',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }
          const setting = await db.setting.findOne();
          await queue.add(async () => {
            const task = await discordLeaderboard(
              discordClient,
              interaction,
              setting,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }

        if (commandName === 'mostactive') {
          await interaction.deferReply().catch((e) => {
            console.log(e);
          });
          const limited = await myRateLimiter(
            discordClient,
            interaction,
            'MostActive',
          );
          if (limited) {
            await interaction.editReply('rate limited').catch((e) => {
              console.log(e);
            });
            return;
          }
          const setting = await db.setting.findOne();
          await queue.add(async () => {
            const task = await discordMostActive(
              discordClient,
              interaction,
              setting,
              io,
            );
          });
          await interaction.editReply('\u200b').catch((e) => {
            console.log(e);
          });
        }
      }
    }
  });

  discordClient.on("messageCreate", async (message) => {
    let groupTask;
    let groupTaskId;
    let channelTask;
    let channelTaskId;
    let lastSeenDiscordTask;
    let disallow;
    if (!message.author.bot) {
      const walletExists = await createUpdateDiscordUser(
        discordClient,
        message.author,
        queue,
      );
      await queue.add(async () => {
        groupTask = await updateDiscordGroup(discordClient, message);
        channelTask = await updateDiscordChannel(message, groupTask);
        lastSeenDiscordTask = await updateDiscordLastSeen(
          message,
          message.author,
        );
      });
      groupTaskId = groupTask && groupTask.id;
      channelTaskId = channelTask && channelTask.id;
    }

    const messageReplaceBreaksWithSpaces = message.content.replace(/\n/g, " ");
    const preFilteredMessageDiscord = messageReplaceBreaksWithSpaces.split(' ');
    const filteredMessageDiscord = preFilteredMessageDiscord.filter((el) => el !== '');

    if (!message.author.bot) {
      const setting = await db.setting.findOne();
      await queue.add(async () => {
        if (message.guildId === setting.discordHomeServerGuildId) {
          const task = await discordActiveTalker(
            discordClient,
            message,
            filteredMessageDiscord,
            io,
          );
        }
      });
    }

    if (!message.content.startsWith(settings.bot.command) || message.author.bot) return;
    const maintenance = await isMaintenanceOrDisabled(message, 'discord');
    if (maintenance.maintenance || !maintenance.enabled) return;
    if (groupTask && groupTask.banned) {
      await message.channel.send({
        embeds: [
          discordServerBannedMessage(
            groupTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (channelTask && channelTask.banned) {
      await message.channel.send({
        embeds: [
          discordChannelBannedMessage(
            channelTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (lastSeenDiscordTask && lastSeenDiscordTask.banned) {
      await message.channel.send({
        embeds: [
          discordUserBannedMessage(
            lastSeenDiscordTask,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (filteredMessageDiscord[1] === undefined) {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Help',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(message, io);
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Help',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'help') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Help',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordHelp(
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'account') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Account',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordAccount(
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'link') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Link',
      );
      if (limited) return;
      const task = await discordLinkAddress(
        message,
        io,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'unlink') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Unlink',
      );
      if (limited) return;
      const task = await discordUnlinkAddress(
        message,
        io,
      );
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'myrank') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Myrank',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordMyRank(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'ranks') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Ranks',
      );
      if (limited) return;
      await queue.add(async () => {
        const task = await discordRanks(
          discordClient,
          message,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'leaderboard') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'Leaderboard',
      );
      if (limited) return;
      const setting = await db.setting.findOne();
      await queue.add(async () => {
        const task = await discordLeaderboard(
          discordClient,
          message,
          setting,
          io,
        );
      });
    }

    if (filteredMessageDiscord[1] && filteredMessageDiscord[1].toLowerCase() === 'mostactive') {
      const limited = await myRateLimiter(
        discordClient,
        message,
        'MostActive',
      );
      if (limited) return;
      const setting = await db.setting.findOne();
      await queue.add(async () => {
        const task = await discordMostActive(
          discordClient,
          message,
          setting,
          io,
        );
      });
    }
  });
};
