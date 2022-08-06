"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, Sequelize) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.bulkInsert('role', [{
                name: 'Tokelnaut',
                discordRoleId: '1005467029664444526',
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                name: 'Tokelnaut 5+',
                discordRoleId: '1005467073637527642',
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                name: 'Tokelnaut 10+',
                discordRoleId: '1001960169246298261',
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                name: 'Tokelnaut 20+',
                discordRoleId: '1005467109628837908',
                createdAt: new Date(),
                updatedAt: new Date()
              }]);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function up(_x, _x2) {
      return _up.apply(this, arguments);
    }

    return up;
  }(),
  down: function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {});
  }
};