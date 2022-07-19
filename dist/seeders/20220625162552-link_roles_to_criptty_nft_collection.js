"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, Sequelize) {
      var generalRole, cripttyRole, criptty;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return queryInterface.rawSelect('role', {
                where: {
                  name: 'General holder'
                }
              }, ['id']);

            case 2:
              generalRole = _context.sent;
              _context.next = 5;
              return queryInterface.rawSelect('role', {
                where: {
                  name: 'Criptty holder'
                }
              }, ['id']);

            case 5:
              cripttyRole = _context.sent;
              _context.next = 8;
              return queryInterface.rawSelect('nftCollection', {
                where: {
                  name: 'criptty'
                }
              }, ['id']);

            case 8:
              criptty = _context.sent;
              _context.next = 11;
              return queryInterface.bulkInsert('NftCollectionRole', [{
                roleId: generalRole,
                nftCollectionId: criptty,
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                roleId: cripttyRole,
                nftCollectionId: criptty,
                createdAt: new Date(),
                updatedAt: new Date()
              }]);

            case 11:
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
    return queryInterface.bulkDelete('NftCollectionRole', null, {});
  }
};