import { EmbedBuilder } from "discord.js";
// import moment from 'moment';
import settings from '../config/settings';
import pjson from "../../package.json";
import { capitalize } from "../helpers/utils";

export const discordUserBannedMessage = (
  user,
) => {
  const result = new EmbedBuilder()
    .setColor("#C70039")
    .setTitle(`🚫     User: ${user.username} Banned     🚫`)
    .setDescription(`Reason:
${user.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordServerBannedMessage = (
  server,
) => {
  const result = new EmbedBuilder()
    .setColor(`#C70039`)
    .setTitle('🚫     Server Banned     🚫')
    .setDescription(`Reason:
${server.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const featureDisabledChannelMessage = (name) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled for this channel`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const featureDisabledServerMessage = (name) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled for this server`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const featureDisabledGlobalMessage = (name) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const priceMessage = (replyString) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Price')
    .setThumbnail(settings.bot.logo)
    .setDescription(replyString)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordChannelBannedMessage = (channel) => {
  const result = new EmbedBuilder()
    .setColor('#FF7900')
    .setTitle('❗     Channel Restricted     ❗')
    .setDescription(`Reason:
${channel.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const coinInfoMessage = (
  blockHeight,
  priceInfo,
  walletVersion,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Tipbot')
    .addField("Coin Info", settings.coin.description)
    .addField("\u200b", "\u200b")
    .addFields(
      { name: "Coin Name", value: settings.coin.name, inline: true },
      { name: "Ticker", value: settings.coin.ticker, inline: true },
    )
    .addField("\u200b", "\u200b")
    .addFields(
      { name: "Current block height", value: `${blockHeight}`, inline: true },
      { name: "Wallet version", value: `${walletVersion}`, inline: true },
    )
    .addField("\u200b", "\u200b")
    .addField("Website", settings.coin.website)
    .addField("Github", settings.coin.github)
    .addField("Block Explorer", settings.coin.explorer)
    .addField("Discord Server", settings.coin.discord)
    .addField("Telegram Group", settings.coin.telegram)
    .addField("Exchanges", settings.coin.exchanges.join('\n'))
    .addField("Current price", `$${priceInfo.price} (source: coinpaprika)`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordLimitSpamMessage = (userId, myFunctionName) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(myFunctionName)
    .setDescription(`🚫 Slow down! 🚫
<@${userId}>, you're using this command too fast, wait a while before using it again.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const cannotSendMessageUser = (title, message) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, ${settings.bot.name} was unable to send you a direct message.\nPlease check your discord privacy settings.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordErrorMessage = (title) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`Something went wrong.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordDepositConfirmedMessage = (
  amount,
  trans,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Deposit #${trans.id}`)
    .setDescription(`Deposit Confirmed
${trans.amount / 1e8} ${settings.coin.ticker} has been credited to your wallet`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordIncomingDepositMessage = (detail) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Deposit #${detail.transaction[0].id}`)
    .setDescription(`incoming deposit detected for ${detail.amount} ${settings.coin.ticker}
Balance will be reflected in your wallet in ~${settings.min.confirmations}+ confirmations
${settings.coin.explorer}/tx/${detail.transaction[0].txid}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordUserWithdrawalRejectMessage = (title) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const reviewMessage = (
  message,
  transaction,
) => {
  const amount = ((transaction.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((transaction.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${transaction.id}`)
    .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed

amount: **${amount} ${settings.coin.ticker}**
fee: **${fee} ${settings.coin.ticker}**
total: **${total} ${settings.coin.ticker}**${settings.coin.setting === 'Pirate' && transaction.memo && transaction.memo !== '' ? `\nmemo: **${transaction.memo}**` : ''}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordWithdrawalAcceptedMessage = (
  updatedTrans,
) => {
  const amount = ((updatedTrans.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((updatedTrans.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${updatedTrans.id}`)
    .setDescription(`Your withdrawal has been accepted

amount: **${amount} ${settings.coin.ticker}**
fee: **${fee} ${settings.coin.ticker}**
total: **${total} ${settings.coin.ticker}**${settings.coin.setting === 'Pirate' && updatedTrans.memo && updatedTrans.memo !== '' ? `\nmemo: **${updatedTrans.memo}**` : ''}

${settings.coin.explorer}/tx/${updatedTrans.txid}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordWithdrawalConfirmedMessage = (userId, trans) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${trans.id}`)
    .setDescription(`<@${userId}>, Your withdrawal has been complete`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const balanceMessage = (userId, user, priceInfo) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Balance')
    .setDescription(`<@${userId}>'s current available balance: ${user.wallet.available / 1e8} ${settings.coin.ticker}
<@${userId}>'s current locked balance: ${user.wallet.locked / 1e8} ${settings.coin.ticker}
Estimated value of <@${userId}>'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const depositAddressMessage = (userId, user) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Deposit')
    .setDescription(`<@${userId}>'s deposit address:
*${user.wallet.addresses[0].address}*`)
    .setImage("attachment://qr.png")
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const walletNotFoundMessage = (message, title) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Wallet not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const userNotFoundMessage = (
  message,
  title,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, User not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const NotInDirectMessage = (message, title) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Can't use this command in a direct message`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordWelcomeMessage = (
  userInfo,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Welcome <@${userInfo.id}>, Welcome to Tokelverse.
Type "${settings.bot.command.discord} help" for bot usage info`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordBotMaintenanceMessage = () => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Discord tipbot maintenance`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const successUnlinkAddress = (
  message,
  address,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${message.author.id}>, successfully unlinked ${address}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const userAlreadyLinkedAnAddressMessage = (
  user,
  address,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${user.user_id}>, You already linked an address.

please unlink it with \`!tokelverse unlink\` before trying to link a new one 

currently linked address: 
**${address}**`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const cancelUnlinkAddress = (
  message,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${message.author.id}>, you canceled unlinking your address`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const timeOutUnlinkAddressMessage = (
  message,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${message.author.id}>, your request to unlink a tokel address has expired`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const confirmUnlinkAddress = (
  message,
  address,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${message.author.id}>, are you sure you want to unlink ${address}?`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const noAddressToUnlink = (
  message,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlink Tokel Address')
    .setDescription(`<@${message.author.id}>, You don't have an address to unlink`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const timeOutTokelLinkAddressMessage = (
  message,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Link Tokel Address')
    .setDescription(`<@${message.author.id}>, your request to link a tokel address has expired`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const enterAddressToLinkMessage = () => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`Please enter the tokel address you would like to link to your discord account:`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const invalidTokelLinkAddress = () => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`You entered an invalid Tokel Address`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const addedNewTokelLinkAddress = (
  message,
  linkedAddress,
  depositAddress,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`Successfully added
please send any amount of tokel 

from: **${linkedAddress}**
to: **${depositAddress}**

to verify this address belongs to you`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const tokelLinkAddressAlreadyBusyVerifying = (message, address) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`You already busy verifying ${address}
Please unlink your current address before adding another`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const tokelLinkAddressAlreadyVerified = (message, address) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`You already verified ${address}`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const tokelLinkAddressAlreadyOccupied = (message, address) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Link tokel address`)
    .setDescription(`${address} is already occupied by another discord account. 
if you lost your discord account and would like to unlink address from your old account, please contact a tokelverse administrator`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordBotDisabledMessage = () => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Discord tipbot disabled`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const warnDirectMessage = (userId, title) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${userId}>, I've sent you a direct message.`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const AccountInfoMessage = () => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Account Information')
    .setDescription(`Shows discord account information`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const alreadyVotedTopGG = (
  userId,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Gain Exp')
    .setDescription(`<@${userId}>, Thank you for your enthousiasme.
You already voted past 12h, so we could not grant you experience`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const levelUpMessage = (
  userId,
  rank,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Gain Exp')
    .setDescription(`Congratulations <@${userId}>
You gained a level
You are now a ${rank.name} (lvl ${rank.id})`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const gainActiveTalkerExpMessage = (
  userId,
  amount,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Gain Exp')
    .setDescription(`<@${userId}>, Thank you for being so talkative in our community today!
you have been rewarded ${amount} experience`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const gainVoteTopggExpMessage = (
  userId,
  amount,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Gain Exp')
    .setDescription(`<@${userId}>, Thank you for voting for Tokelverse on TopGG.
you have been rewarded ${amount} experience`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const invitedNewUserRewardMessage = (
  userId,
  joinedUserId,
  amount,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Gain Exp')
    .setDescription(`<@${userId}>, Thank you for inviting <@${joinedUserId}> to the Tokelverse server.
you have been rewarded ${amount} experience`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const linkedAddressVerified = (
  discordId,
  linkedAddress,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Link tokel address')
    .setDescription(`Thank you, <@${discordId}>,
We successfully linked **${linkedAddress}** to your discord account`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const discordTransactionMemoTooLongMessage = (
  message,
  memoLength,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Your withdrawal memo is too long!
We found ${memoLength} characters, maximum length is 512`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const userUnlinkedAddressRolesLostMessage = (
  user,
  roles,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Unlinked address')
    .setDescription(`<@${user.user_id}>, has unlinked his/her address
and has lost ${roles.length} ${roles.length === 1 ? 'role' : 'roles'}
    ${roles.map((roleId) => `<@&${roleId}>`).join("\n")}`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const userRolesLostMessage = (
  user,
  roles,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Lost Roles')
    .setDescription(`<@${user.user_id}>, Lost ${roles.length} ${roles.length === 1 ? 'role' : 'roles'}
${roles.map((roleId) => `<@&${roleId}>`).join("\n")}`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const userEarnedRolesMessage = (
  user,
  roles,
) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle('Earned Roles')
    .setDescription(`<@${user.user_id}>, Earned ${roles.length} ${roles.length === 1 ? 'role' : 'roles'}
${roles.map((roleId) => `<@&${roleId}>`).join("\n")}`)
    .setThumbnail(settings.bot.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });

  return result;
};

export const helpMessage = (withdraw) => {
  const result = new EmbedBuilder()
    .setColor(settings.bot.color)
    .setTitle(`${`${settings.bot.name} v${pjson.version}`} Help`)
    .setDescription(`\`${settings.bot.command}\`
Displays this message

\`${settings.bot.command} help\`
Displays this message

\`${settings.bot.command} link\`
Link a tokel address to your discord account

\`${settings.bot.command} unlink\`
Link a tokel address to your discord account

\`${settings.bot.command} myrank\`
Shows your rank

\`${settings.bot.command} leaderboard\`
Shows the leaderboard

\`${settings.bot.command} mostactive\`
Shows most active users past month

\`${settings.bot.command} ranks\`
Shows all the ranks to earn`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.bot.logo,
    });
  return result;
};
