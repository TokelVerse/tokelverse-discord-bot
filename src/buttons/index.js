import {
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const generateNoButton = () => {
  const result = new ButtonBuilder({
    style: ButtonStyle.Secondary,
    label: 'No',
    emoji: '<a:rejected:993469997596815393>',
    customId: 'no',
  });

  return result;
};

export const generateYesButton = () => {
  const result = new ButtonBuilder({
    style: ButtonStyle.Secondary,
    label: 'Yes',
    emoji: '<a:checkmark:993469790343671848>',
    customId: 'yes',
  });

  return result;
};
