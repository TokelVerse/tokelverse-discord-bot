import { config } from "dotenv";
import {
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { REST } from '@discordjs/rest';
import db from '../../models';
import settings from '../../config/settings';

config();

const mainTipBotCommand = new SlashCommandBuilder().setName(`${settings.bot.command.slash}`).setDescription(`'Use ${settings.bot.name}`);

mainTipBotCommand
  .addSubcommand(
    (subcommand) => subcommand
      .setName('help')
      .setDescription(`${settings.bot.name} usage info`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('myrank')
      .setDescription(`Displays the user's rank`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('ranks')
      .setDescription(`Displays all the ranks`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('leaderboard')
      .setDescription(`Displays the user's rank`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('mostactive')
      .setDescription(`Displays the top ten most active users (chatting)`),
  )
  // .addSubcommand(
  //   (subcommand) => subcommand
  //     .setName('balance')
  //     .setDescription(`Display your balance`),
  // )
  // .addSubcommand(
  //   (subcommand) => subcommand
  //     .setName('deposit')
  //     .setDescription(`Displays your deposit address`),
  // )
  // .addSubcommand(
  //   (subcommand) => subcommand
  //     .setName('withdraw')
  //     .setDescription(`Starts Withdrawal process`),
  // )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('link')
      .setDescription(`Starts tokel address link process`),
  )
  .addSubcommand(
    (subcommand) => subcommand
      .setName('unlink')
      .setDescription(`Starts tokel address unlink process`),
  );

const commands = [
  mainTipBotCommand,
].map((command) => command.toJSON());

export const deployCommands = async (
  botToken,
  clientId,
) => {
  const setting = await db.setting.findOne();

  const rest = new REST({ version: '10' }).setToken(botToken);

  rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
};
