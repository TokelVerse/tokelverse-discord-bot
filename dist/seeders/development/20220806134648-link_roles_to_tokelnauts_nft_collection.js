"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  up: function () {
    var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryInterface, Sequelize) {
      var generalRole, tokelnaut, tokelnautfive, tokelnautten, tokelnauttwenty, tokelnautCollection;
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
                  name: 'Tokelnaut'
                }
              }, ['id']);

            case 5:
              tokelnaut = _context.sent;
              _context.next = 8;
              return queryInterface.rawSelect('role', {
                where: {
                  name: 'Tokelnaut 5+'
                }
              }, ['id']);

            case 8:
              tokelnautfive = _context.sent;
              _context.next = 11;
              return queryInterface.rawSelect('role', {
                where: {
                  name: 'Tokelnaut 10+'
                }
              }, ['id']);

            case 11:
              tokelnautten = _context.sent;
              _context.next = 14;
              return queryInterface.rawSelect('role', {
                where: {
                  name: 'Tokelnaut 20+'
                }
              }, ['id']);

            case 14:
              tokelnauttwenty = _context.sent;
              _context.next = 17;
              return queryInterface.rawSelect('nftCollection', {
                where: {
                  name: 'Tokelnauts'
                }
              }, ['id']);

            case 17:
              tokelnautCollection = _context.sent;
              _context.next = 20;
              return queryInterface.bulkInsert('NftCollectionRole', [{
                roleId: generalRole,
                nftCollectionId: tokelnautCollection,
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                roleId: tokelnaut,
                nftCollectionId: tokelnautCollection,
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                roleId: tokelnautfive,
                nftCollectionId: tokelnautCollection,
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                roleId: tokelnautten,
                nftCollectionId: tokelnautCollection,
                createdAt: new Date(),
                updatedAt: new Date()
              }, {
                roleId: tokelnauttwenty,
                nftCollectionId: tokelnautCollection,
                createdAt: new Date(),
                updatedAt: new Date()
              }]);

            case 20:
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