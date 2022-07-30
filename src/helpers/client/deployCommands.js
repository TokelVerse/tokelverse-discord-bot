import { config } from "dotenv";
import {
  SlashCommandBuilder,
} from "discord.js";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import db from '../../models';

config();

const commands = [
  new SlashCommandBuilder().setName('help').setDescription('DM\'s you with a help message'),
  new SlashCommandBuilder().setName('myrank').setDescription('Displays the user\'s rank'),
  new SlashCommandBuilder().setName('ranks').setDescription('Displays all the ranks'),
  new SlashCommandBuilder().setName('leaderboard').setDescription('Displays the top ten leaderboard'),
  new SlashCommandBuilder().setName('mostactive').setDescription('Displays the top ten most active users (chatting)'),
  new SlashCommandBuilder().setName('balance').setDescription('Display your balance'),
  new SlashCommandBuilder().setName('deposit').setDescription('Displays your deposit address!'),
  new SlashCommandBuilder().setName('withdraw').setDescription('Starts Withdrawal process'),
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
