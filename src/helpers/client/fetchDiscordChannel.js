import {
  InteractionType,
  ChannelType,
  MessageType,
} from "discord.js";

export const fetchDiscordChannel = async (
  discordClient,
  message,
) => {
  let discordChannel;
  let discordUserDMChannel;

  if (message.channel.type === ChannelType.DM) {
    discordChannel = await discordClient.channels.cache.get(message.channelId);
    discordUserDMChannel = await discordClient.channels.cache.get(message.channelId);
  }
  if (message.channel.type === ChannelType.GuildText) {
    console.log(message);
    discordChannel = await discordClient.channels.cache.get(message.channelId);
    if (message.type && message.type === InteractionType.ApplicationCommand) {
      discordUserDMChannel = await discordClient.users.cache.get(message.user.id);
    } else if (
      message.type === MessageType.Default
        || message.type === MessageType.Reply
    ) {
      discordUserDMChannel = await discordClient.users.cache.get(message.author.id);
    } else {
      discordUserDMChannel = await discordClient.users.cache.get(message.user.id);
    }
  }

  return [
    discordChannel,
    discordUserDMChannel,
  ];
};
