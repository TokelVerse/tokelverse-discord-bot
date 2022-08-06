"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deployCommands = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _discord = require("discord.js");

var _rest = require("@discordjs/rest");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

(0, _dotenv.config)();
var mainTipBotCommand = new _discord.SlashCommandBuilder().setName("".concat(_settings["default"].bot.command.slash)).setDescription("'Use ".concat(_settings["default"].bot.name));
mainTipBotCommand.addSubcommand(function (subcommand) {
  return subcommand.setName('help').setDescription("".concat(_settings["default"].bot.name, " usage info"));
}).addSubcommand(function (subcommand) {
  return subcommand.setName('myrank').setDescription("Displays the user's rank");
}).addSubcommand(function (subcommand) {
  return subcommand.setName('ranks').setDescription("Displays all the ranks");
}).addSubcommand(function (subcommand) {
  return subcommand.setName('leaderboard').setDescription("Displays the user's rank");
}).addSubcommand(function (subcommand) {
  return subcommand.setName('mostactive').setDescription("Displays the top ten most active users (chatting)");
}) // .addSubcommand(
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
.addSubcommand(function (subcommand) {
  return subcommand.setName('link').setDescription("Starts tokel address link process");
}).addSubcommand(function (subcommand) {
  return subcommand.setName('unlink').setDescription("Starts tokel address unlink process");
});
var commands = [mainTipBotCommand].map(function (command) {
  return command.toJSON();
});

var deployCommands = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(botToken, clientId) {
    var setting, rest;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].setting.findOne();

          case 2:
            setting = _context.sent;
            rest = new _rest.REST({
              version: '10'
            }).setToken(botToken);
            rest.put(_discord.Routes.applicationCommands(clientId), {
              body: commands
            }).then(function () {
              return console.log('Successfully registered application commands.');
            })["catch"](console.error);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deployCommands(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.deployCommands = deployCommands;