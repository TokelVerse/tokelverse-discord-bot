"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateYesButton = exports.generateNoButton = void 0;

var _discord = require("discord.js");

var generateNoButton = function generateNoButton() {
  var result = new _discord.ButtonBuilder({
    style: _discord.ButtonStyle.Secondary,
    label: 'No',
    emoji: '<a:rejected:993469997596815393>',
    customId: 'no'
  });
  return result;
};

exports.generateNoButton = generateNoButton;

var generateYesButton = function generateYesButton() {
  var result = new _discord.ButtonBuilder({
    style: _discord.ButtonStyle.Secondary,
    label: 'Yes',
    emoji: '<a:checkmark:993469790343671848>',
    customId: 'yes'
  });
  return result;
};

exports.generateYesButton = generateYesButton;