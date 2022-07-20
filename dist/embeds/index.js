"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnDirectMessage = exports.walletNotFoundMessage = exports.userUnlinkedAddressRolesLostMessage = exports.userRolesLostMessage = exports.userNotFoundMessage = exports.userEarnedRolesMessage = exports.userAlreadyLinkedAnAddressMessage = exports.tokelLinkAddressAlreadyVerified = exports.tokelLinkAddressAlreadyOccupied = exports.tokelLinkAddressAlreadyBusyVerifying = exports.timeOutUnlinkAddressMessage = exports.timeOutTokelLinkAddressMessage = exports.successUnlinkAddress = exports.reviewMessage = exports.priceMessage = exports.noAddressToUnlink = exports.linkedAddressVerified = exports.levelUpMessage = exports.invitedNewUserRewardMessage = exports.invalidTokelLinkAddress = exports.helpMessage = exports.gainVoteTopggExpMessage = exports.gainActiveTalkerExpMessage = exports.enterAddressToLinkMessage = exports.discordWithdrawalConfirmedMessage = exports.discordWithdrawalAcceptedMessage = exports.discordWelcomeMessage = exports.discordUserWithdrawalRejectMessage = exports.discordUserBannedMessage = exports.discordTransactionMemoTooLongMessage = exports.discordServerBannedMessage = exports.discordLimitSpamMessage = exports.discordIncomingDepositMessage = exports.discordErrorMessage = exports.discordDepositConfirmedMessage = exports.discordChannelBannedMessage = exports.discordBotMaintenanceMessage = exports.discordBotDisabledMessage = exports.depositAddressMessage = exports.confirmUnlinkAddress = exports.coinInfoMessage = exports.cannotSendMessageUser = exports.cancelUnlinkAddress = exports.balanceMessage = exports.alreadyVotedTopGG = exports.addedNewTokelLinkAddress = exports.NotInDirectMessage = exports.AccountInfoMessage = void 0;

var _discord = require("discord.js");

var _settings = _interopRequireDefault(require("../config/settings"));

var _package = _interopRequireDefault(require("../../package.json"));

var _utils = require("../helpers/utils");

// import moment from 'moment';
var discordUserBannedMessage = function discordUserBannedMessage(user) {
  var result = new _discord.EmbedBuilder().setColor("#C70039").setTitle("\uD83D\uDEAB     User: ".concat(user.username, " Banned     \uD83D\uDEAB")).setDescription("Reason:\n".concat(user.banMessage)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordUserBannedMessage = discordUserBannedMessage;

var discordServerBannedMessage = function discordServerBannedMessage(server) {
  var result = new _discord.EmbedBuilder().setColor("#C70039").setTitle('🚫     Server Banned     🚫').setDescription("Reason:\n".concat(server.banMessage)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordServerBannedMessage = discordServerBannedMessage;

var priceMessage = function priceMessage(replyString) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Price').setThumbnail(_settings["default"].bot.logo).setDescription(replyString).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.priceMessage = priceMessage;

var discordChannelBannedMessage = function discordChannelBannedMessage(channel) {
  var result = new _discord.EmbedBuilder().setColor('#FF7900').setTitle('❗     Channel Restricted     ❗').setDescription("Reason:\n".concat(channel.banMessage)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordChannelBannedMessage = discordChannelBannedMessage;

var coinInfoMessage = function coinInfoMessage(blockHeight, priceInfo, walletVersion) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Tipbot').addField("Coin Info", _settings["default"].coin.description).addField("\u200B", "\u200B").addFields({
    name: "Coin Name",
    value: _settings["default"].coin.name,
    inline: true
  }, {
    name: "Ticker",
    value: _settings["default"].coin.ticker,
    inline: true
  }).addField("\u200B", "\u200B").addFields({
    name: "Current block height",
    value: "".concat(blockHeight),
    inline: true
  }, {
    name: "Wallet version",
    value: "".concat(walletVersion),
    inline: true
  }).addField("\u200B", "\u200B").addField("Website", _settings["default"].coin.website).addField("Github", _settings["default"].coin.github).addField("Block Explorer", _settings["default"].coin.explorer).addField("Discord Server", _settings["default"].coin.discord).addField("Telegram Group", _settings["default"].coin.telegram).addField("Exchanges", _settings["default"].coin.exchanges.join('\n')).addField("Current price", "$".concat(priceInfo.price, " (source: coinpaprika)")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.coinInfoMessage = coinInfoMessage;

var discordLimitSpamMessage = function discordLimitSpamMessage(userId, myFunctionName) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(myFunctionName).setDescription("\uD83D\uDEAB Slow down! \uD83D\uDEAB\n<@".concat(userId, ">, you're using this command too fast, wait a while before using it again.")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordLimitSpamMessage = discordLimitSpamMessage;

var cannotSendMessageUser = function cannotSendMessageUser(title, message) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, ").concat(_settings["default"].bot.name, " was unable to send you a direct message.\nPlease check your discord privacy settings.")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.cannotSendMessageUser = cannotSendMessageUser;

var discordErrorMessage = function discordErrorMessage(title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("Something went wrong.").setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordErrorMessage = discordErrorMessage;

var discordDepositConfirmedMessage = function discordDepositConfirmedMessage(amount, trans) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Deposit #".concat(trans.id)).setDescription("Deposit Confirmed\n".concat(trans.amount / 1e8, " ").concat(_settings["default"].coin.ticker, " has been credited to your wallet")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordDepositConfirmedMessage = discordDepositConfirmedMessage;

var discordIncomingDepositMessage = function discordIncomingDepositMessage(detail) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Deposit #".concat(detail.transaction[0].id)).setDescription("incoming deposit detected for ".concat(detail.amount, " ").concat(_settings["default"].coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(_settings["default"].min.confirmations, "+ confirmations\n").concat(_settings["default"].coin.explorer, "/tx/").concat(detail.transaction[0].txid)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordIncomingDepositMessage = discordIncomingDepositMessage;

var discordUserWithdrawalRejectMessage = function discordUserWithdrawalRejectMessage(title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been rejected").setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordUserWithdrawalRejectMessage = discordUserWithdrawalRejectMessage;

var reviewMessage = function reviewMessage(message, transaction) {
  var amount = (transaction.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (transaction.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Withdraw #".concat(transaction.id)).setDescription("<@".concat(message.author.id, ">, Your withdrawal is being reviewed\n\namount: **").concat(amount, " ").concat(_settings["default"].coin.ticker, "**\nfee: **").concat(fee, " ").concat(_settings["default"].coin.ticker, "**\ntotal: **").concat(total, " ").concat(_settings["default"].coin.ticker, "**").concat(_settings["default"].coin.setting === 'Pirate' && transaction.memo && transaction.memo !== '' ? "\nmemo: **".concat(transaction.memo, "**") : '')).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.reviewMessage = reviewMessage;

var discordWithdrawalAcceptedMessage = function discordWithdrawalAcceptedMessage(updatedTrans) {
  var amount = (updatedTrans.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (updatedTrans.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Withdraw #".concat(updatedTrans.id)).setDescription("Your withdrawal has been accepted\n\namount: **".concat(amount, " ").concat(_settings["default"].coin.ticker, "**\nfee: **").concat(fee, " ").concat(_settings["default"].coin.ticker, "**\ntotal: **").concat(total, " ").concat(_settings["default"].coin.ticker, "**").concat(_settings["default"].coin.setting === 'Pirate' && updatedTrans.memo && updatedTrans.memo !== '' ? "\nmemo: **".concat(updatedTrans.memo, "**") : '', "\n\n").concat(_settings["default"].coin.explorer, "/tx/").concat(updatedTrans.txid)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordWithdrawalAcceptedMessage = discordWithdrawalAcceptedMessage;

var discordWithdrawalConfirmedMessage = function discordWithdrawalConfirmedMessage(userId, trans) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Withdraw #".concat(trans.id)).setDescription("<@".concat(userId, ">, Your withdrawal has been complete")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordWithdrawalConfirmedMessage = discordWithdrawalConfirmedMessage;

var balanceMessage = function balanceMessage(userId, user, priceInfo) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Balance').setDescription("<@".concat(userId, ">'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(_settings["default"].coin.ticker, "\n<@").concat(userId, ">'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(_settings["default"].coin.ticker, "\nEstimated value of <@").concat(userId, ">'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2))).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.balanceMessage = balanceMessage;

var depositAddressMessage = function depositAddressMessage(userId, user) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Deposit').setDescription("<@".concat(userId, ">'s deposit address:\n*").concat(user.wallet.addresses[0].address, "*")).setImage("attachment://qr.png").setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var walletNotFoundMessage = function walletNotFoundMessage(message, title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Wallet not found")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.walletNotFoundMessage = walletNotFoundMessage;

var userNotFoundMessage = function userNotFoundMessage(message, title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, User not found")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.userNotFoundMessage = userNotFoundMessage;

var NotInDirectMessage = function NotInDirectMessage(message, title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Can't use this command in a direct message")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.NotInDirectMessage = NotInDirectMessage;

var discordWelcomeMessage = function discordWelcomeMessage(userInfo) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Bot").setDescription("Welcome <@".concat(userInfo.id, ">, Welcome to Tokelverse.\nType \"").concat(_settings["default"].bot.command.discord, " help\" for bot usage info")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordWelcomeMessage = discordWelcomeMessage;

var discordBotMaintenanceMessage = function discordBotMaintenanceMessage() {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Bot").setDescription("Discord tipbot maintenance").setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordBotMaintenanceMessage = discordBotMaintenanceMessage;

var successUnlinkAddress = function successUnlinkAddress(message, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(message.author.id, ">, successfully unlinked ").concat(address)).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.successUnlinkAddress = successUnlinkAddress;

var userAlreadyLinkedAnAddressMessage = function userAlreadyLinkedAnAddressMessage(user, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(user.user_id, ">, You already linked an address.\n\nplease unlink it with `!tokelverse unlink` before trying to link a new one \n\ncurrently linked address: \n**").concat(address, "**")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.userAlreadyLinkedAnAddressMessage = userAlreadyLinkedAnAddressMessage;

var cancelUnlinkAddress = function cancelUnlinkAddress(message) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(message.author.id, ">, you canceled unlinking your address")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.cancelUnlinkAddress = cancelUnlinkAddress;

var timeOutUnlinkAddressMessage = function timeOutUnlinkAddressMessage(message) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(message.author.id, ">, your request to unlink a tokel address has expired")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.timeOutUnlinkAddressMessage = timeOutUnlinkAddressMessage;

var confirmUnlinkAddress = function confirmUnlinkAddress(message, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(message.author.id, ">, are you sure you want to unlink ").concat(address, "?")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.confirmUnlinkAddress = confirmUnlinkAddress;

var noAddressToUnlink = function noAddressToUnlink(message) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlink Tokel Address').setDescription("<@".concat(message.author.id, ">, You don't have an address to unlink")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.noAddressToUnlink = noAddressToUnlink;

var timeOutTokelLinkAddressMessage = function timeOutTokelLinkAddressMessage(message) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Link Tokel Address').setDescription("<@".concat(message.author.id, ">, your request to link a tokel address has expired")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.timeOutTokelLinkAddressMessage = timeOutTokelLinkAddressMessage;

var enterAddressToLinkMessage = function enterAddressToLinkMessage() {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("Please enter the tokel address you would like to link to your discord account:").setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.enterAddressToLinkMessage = enterAddressToLinkMessage;

var invalidTokelLinkAddress = function invalidTokelLinkAddress() {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("You entered an invalid Tokel Address").setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.invalidTokelLinkAddress = invalidTokelLinkAddress;

var addedNewTokelLinkAddress = function addedNewTokelLinkAddress(message, linkedAddress, depositAddress) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("Successfully added\nplease send any amount of tokel \n\nfrom: **".concat(linkedAddress, "**\nto: **").concat(depositAddress, "**\n\nto verify this address belongs to you")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.addedNewTokelLinkAddress = addedNewTokelLinkAddress;

var tokelLinkAddressAlreadyBusyVerifying = function tokelLinkAddressAlreadyBusyVerifying(message, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("You already busy verifying ".concat(address, "\nPlease unlink your current address before adding another")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.tokelLinkAddressAlreadyBusyVerifying = tokelLinkAddressAlreadyBusyVerifying;

var tokelLinkAddressAlreadyVerified = function tokelLinkAddressAlreadyVerified(message, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("You already verified ".concat(address)).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.tokelLinkAddressAlreadyVerified = tokelLinkAddressAlreadyVerified;

var tokelLinkAddressAlreadyOccupied = function tokelLinkAddressAlreadyOccupied(message, address) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Link tokel address").setDescription("".concat(address, " is already occupied by another discord account. \nif you lost your discord account and would like to unlink address from your old account, please contact a tokelverse administrator")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.tokelLinkAddressAlreadyOccupied = tokelLinkAddressAlreadyOccupied;

var discordBotDisabledMessage = function discordBotDisabledMessage() {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("Bot").setDescription("Discord tipbot disabled").setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordBotDisabledMessage = discordBotDisabledMessage;

var warnDirectMessage = function warnDirectMessage(userId, title) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(userId, ">, I've sent you a direct message.")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.warnDirectMessage = warnDirectMessage;

var AccountInfoMessage = function AccountInfoMessage() {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Account Information').setDescription("Shows discord account information").setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.AccountInfoMessage = AccountInfoMessage;

var alreadyVotedTopGG = function alreadyVotedTopGG(userId) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Gain Exp').setDescription("<@".concat(userId, ">, Thank you for your enthousiasme.\nYou already voted past 12h, so we could not grant you experience")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.alreadyVotedTopGG = alreadyVotedTopGG;

var levelUpMessage = function levelUpMessage(userId, rank) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Gain Exp').setDescription("Congratulations <@".concat(userId, ">\nYou gained a level\nYou are now a ").concat(rank.name, " (lvl ").concat(rank.id, ")")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.levelUpMessage = levelUpMessage;

var gainActiveTalkerExpMessage = function gainActiveTalkerExpMessage(userId, amount) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Gain Exp').setDescription("<@".concat(userId, ">, Thank you for being so talkative in our community today!\nyou have been rewarded ").concat(amount, " experience")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.gainActiveTalkerExpMessage = gainActiveTalkerExpMessage;

var gainVoteTopggExpMessage = function gainVoteTopggExpMessage(userId, amount) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Gain Exp').setDescription("<@".concat(userId, ">, Thank you for voting for Tokelverse on TopGG.\nyou have been rewarded ").concat(amount, " experience")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.gainVoteTopggExpMessage = gainVoteTopggExpMessage;

var invitedNewUserRewardMessage = function invitedNewUserRewardMessage(userId, joinedUserId, amount) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Gain Exp').setDescription("<@".concat(userId, ">, Thank you for inviting <@").concat(joinedUserId, "> to the Tokelverse server.\nyou have been rewarded ").concat(amount, " experience")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.invitedNewUserRewardMessage = invitedNewUserRewardMessage;

var linkedAddressVerified = function linkedAddressVerified(discordId, linkedAddress) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Link tokel address').setDescription("Thank you, <@".concat(discordId, ">,\nWe successfully linked **").concat(linkedAddress, "** to your discord account")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.linkedAddressVerified = linkedAddressVerified;

var discordTransactionMemoTooLongMessage = function discordTransactionMemoTooLongMessage(message, memoLength) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Your withdrawal memo is too long!\nWe found ").concat(memoLength, " characters, maximum length is 512")).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.discordTransactionMemoTooLongMessage = discordTransactionMemoTooLongMessage;

var userUnlinkedAddressRolesLostMessage = function userUnlinkedAddressRolesLostMessage(user, roles) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Unlinked address').setDescription("<@".concat(user.user_id, ">, has unlinked his/her address\nand has lost ").concat(roles.length, " ").concat(roles.length === 1 ? 'role' : 'roles', "\n    ").concat(roles.map(function (roleId) {
    return "<@&".concat(roleId, ">");
  }).join("\n"))).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.userUnlinkedAddressRolesLostMessage = userUnlinkedAddressRolesLostMessage;

var userRolesLostMessage = function userRolesLostMessage(user, roles) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Lost Roles').setDescription("<@".concat(user.user_id, ">, Lost ").concat(roles.length, " ").concat(roles.length === 1 ? 'role' : 'roles', "\n").concat(roles.map(function (roleId) {
    return "<@&".concat(roleId, ">");
  }).join("\n"))).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.userRolesLostMessage = userRolesLostMessage;

var userEarnedRolesMessage = function userEarnedRolesMessage(user, roles) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle('Earned Roles').setDescription("<@".concat(user.user_id, ">, Earned ").concat(roles.length, " ").concat(roles.length === 1 ? 'role' : 'roles', "\n").concat(roles.map(function (roleId) {
    return "<@&".concat(roleId, ">");
  }).join("\n"))).setThumbnail(_settings["default"].bot.logo).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.userEarnedRolesMessage = userEarnedRolesMessage;

var helpMessage = function helpMessage(withdraw) {
  var result = new _discord.EmbedBuilder().setColor(_settings["default"].bot.color).setTitle("".concat("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), " Help")).setDescription("`".concat(_settings["default"].bot.command, "`\nDisplays this message\n\n`").concat(_settings["default"].bot.command, " help`\nDisplays this message\n\n`").concat(_settings["default"].bot.command, " link`\nLink a tokel address to your discord account\n\n`").concat(_settings["default"].bot.command, " unlink`\nLink a tokel address to your discord account\n\n`").concat(_settings["default"].bot.command, " myrank`\nShows your rank\n\n`").concat(_settings["default"].bot.command, " leaderboard`\nShows the leaderboard\n\n`").concat(_settings["default"].bot.command, " mostactive`\nShows most active users past month\n\n`").concat(_settings["default"].bot.command, " ranks`\nShows all the ranks to earn")).setTimestamp().setFooter({
    text: "".concat(_settings["default"].bot.name, " v").concat(_package["default"].version),
    iconURL: _settings["default"].bot.logo
  });
  return result;
};

exports.helpMessage = helpMessage;