import { config } from "dotenv";
import { updateDiscordChannel } from '../controllers/channel';
import { updateDiscordGroup } from '../controllers/group';
import { discordHelp } from '../controllers/help';
import { discordLinkAddress } from '../controllers/link';
import { discordUnlinkAddress } from '../controllers/unlink';
import { discordActiveTalker } from '../controllers/activeTalker';
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
  discordClient.user.setPresence({
    activities: [{
      name: `!tokelverse`,
      type: "PLAYING",
    }],
  });

  discordClient.on('voiceStateUpdate', async (oldMember, newMember) => {
    await queue.add(async () => {
      const groupTask = await updateDiscordGroup(discordClient, newMember);
      const channelTask = await updateDiscordChannel(newMember, groupTask);
    });
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

    if (!message.content.startsWith(settings.bot.command.discord) || message.author.bot) return;
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
  });
  console.log(`Logged in as ${discordClient.user.tag}!`);
};
