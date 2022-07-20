"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startNftCheck = startNftCheck;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../../models"));

var _embeds = require("../../../embeds");

var _rclient = require("../../../services/rclient");

var _addCripttyRole = require("./roles/criptty/addCripttyRole");

var _removeCripttyRole = require("./roles/criptty/removeCripttyRole");

var _addGeneralHolderRole = require("./roles/general/addGeneralHolderRole");

var _removeGeneralHolderRole = require("./roles/general/removeGeneralHolderRole");

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

function startNftCheck(_x) {
  return _startNftCheck.apply(this, arguments);
}

function _startNftCheck() {
  _startNftCheck = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(discordClient) {
    var setting, discordChannel, guild, allUserWithNFT, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, allNft, allEnabledLinkedAddresses, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _loop3, _iterator2, _step2, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4;

    return _regenerator["default"].wrap(function _callee9$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _models["default"].setting.findOne();

          case 2:
            setting = _context13.sent;
            _context13.next = 5;
            return discordClient.channels.cache.get(setting.expRewardChannelId);

          case 5:
            discordChannel = _context13.sent;
            _context13.next = 8;
            return discordClient.guilds.cache.get(setting.discordHomeServerGuildId);

          case 8:
            guild = _context13.sent;
            _context13.next = 11;
            return _models["default"].user.findAll({
              include: [{
                model: _models["default"].nft,
                as: 'nfts',
                required: true
              }, {
                model: _models["default"].linkedAddress,
                as: 'linkedAddress',
                required: false,
                where: {
                  enabled: true,
                  verified: true
                }
              }]
            });

          case 11:
            allUserWithNFT = _context13.sent;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context13.prev = 14;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var userWithNFT, member, tokelPubkeyBalances, _loop2;

              return _regenerator["default"].wrap(function _loop$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      userWithNFT = _step.value;
                      console.log(userWithNFT.linkedAddress);
                      console.log('user linked address');
                      _context8.next = 5;
                      return guild.members.cache.get(userWithNFT.user_id);

                    case 5:
                      member = _context8.sent;

                      if (userWithNFT.linkedAddress) {
                        _context8.next = 9;
                        break;
                      }

                      _context8.next = 9;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                          var _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, nft, rolesLost, _yield$removeGeneralH, _yield$removeGeneralH2, _yield$removeCripttyR, _yield$removeCripttyR2;

                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  console.log('user unlinked his address therefor he loses all roles');
                                  _iteratorAbruptCompletion5 = false;
                                  _didIteratorError5 = false;
                                  _context.prev = 3;
                                  _iterator5 = _asyncIterator(userWithNFT.nfts);

                                case 5:
                                  _context.next = 7;
                                  return _iterator5.next();

                                case 7:
                                  if (!(_iteratorAbruptCompletion5 = !(_step5 = _context.sent).done)) {
                                    _context.next = 14;
                                    break;
                                  }

                                  nft = _step5.value;
                                  _context.next = 11;
                                  return nft.update({
                                    userId: null
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 11:
                                  _iteratorAbruptCompletion5 = false;
                                  _context.next = 5;
                                  break;

                                case 14:
                                  _context.next = 20;
                                  break;

                                case 16:
                                  _context.prev = 16;
                                  _context.t0 = _context["catch"](3);
                                  _didIteratorError5 = true;
                                  _iteratorError5 = _context.t0;

                                case 20:
                                  _context.prev = 20;
                                  _context.prev = 21;

                                  if (!(_iteratorAbruptCompletion5 && _iterator5["return"] != null)) {
                                    _context.next = 25;
                                    break;
                                  }

                                  _context.next = 25;
                                  return _iterator5["return"]();

                                case 25:
                                  _context.prev = 25;

                                  if (!_didIteratorError5) {
                                    _context.next = 28;
                                    break;
                                  }

                                  throw _iteratorError5;

                                case 28:
                                  return _context.finish(25);

                                case 29:
                                  return _context.finish(20);

                                case 30:
                                  rolesLost = [];
                                  _context.next = 33;
                                  return (0, _removeGeneralHolderRole.removeGeneralHolderRole)(userWithNFT, member, rolesLost, t);

                                case 33:
                                  _yield$removeGeneralH = _context.sent;
                                  _yield$removeGeneralH2 = (0, _slicedToArray2["default"])(_yield$removeGeneralH, 1);
                                  rolesLost = _yield$removeGeneralH2[0];
                                  _context.next = 38;
                                  return (0, _removeCripttyRole.removeCripttyRole)(userWithNFT, member, rolesLost, t);

                                case 38:
                                  _yield$removeCripttyR = _context.sent;
                                  _yield$removeCripttyR2 = (0, _slicedToArray2["default"])(_yield$removeCripttyR, 1);
                                  rolesLost = _yield$removeCripttyR2[0];
                                  console.log(rolesLost);

                                  if (!(rolesLost.length > 0)) {
                                    _context.next = 45;
                                    break;
                                  }

                                  _context.next = 45;
                                  return discordChannel.send({
                                    embeds: [(0, _embeds.userUnlinkedAddressRolesLostMessage)(userWithNFT, rolesLost)]
                                  });

                                case 45:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, null, [[3, 16, 20, 30], [21,, 25, 29]]);
                        }));

                        return function (_x2) {
                          return _ref.apply(this, arguments);
                        };
                      }())["catch"]( /*#__PURE__*/function () {
                        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  console.log(err);
                                  _context2.prev = 1;
                                  _context2.next = 4;
                                  return _models["default"].error.create({
                                    type: 'unlinkedAddressLoseNft',
                                    error: "".concat(err)
                                  });

                                case 4:
                                  _context2.next = 9;
                                  break;

                                case 6:
                                  _context2.prev = 6;
                                  _context2.t0 = _context2["catch"](1);
                                  console.log(_context2.t0);

                                case 9:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, null, [[1, 6]]);
                        }));

                        return function (_x3) {
                          return _ref2.apply(this, arguments);
                        };
                      }());

                    case 9:
                      // check if user still owns NFT here
                      tokelPubkeyBalances = void 0;

                      if (!userWithNFT.linkedAddress) {
                        _context8.next = 14;
                        break;
                      }

                      _context8.next = 13;
                      return (0, _rclient.getInstance)().tokenv2AllBalances(userWithNFT.linkedAddress.pubKey);

                    case 13:
                      tokelPubkeyBalances = _context8.sent;

                    case 14:
                      _iteratorAbruptCompletion3 = false;
                      _didIteratorError3 = false;
                      _context8.prev = 16;
                      _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                        var nft, checkKeyPresenceInArray;
                        return _regenerator["default"].wrap(function _loop2$(_context7) {
                          while (1) {
                            switch (_context7.prev = _context7.next) {
                              case 0:
                                nft = _step3.value;

                                if (!tokelPubkeyBalances) {
                                  _context7.next = 6;
                                  break;
                                }

                                checkKeyPresenceInArray = tokelPubkeyBalances.some(function (obj) {
                                  return Object.keys(obj).includes(nft.tokenId);
                                });

                                if (checkKeyPresenceInArray) {
                                  _context7.next = 6;
                                  break;
                                }

                                _context7.next = 6;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                                      while (1) {
                                        switch (_context3.prev = _context3.next) {
                                          case 0:
                                            _context3.next = 2;
                                            return nft.update({
                                              userId: null
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 2:
                                          case "end":
                                            return _context3.stop();
                                        }
                                      }
                                    }, _callee3);
                                  }));

                                  return function (_x4) {
                                    return _ref3.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err) {
                                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                                      while (1) {
                                        switch (_context4.prev = _context4.next) {
                                          case 0:
                                            console.log(err);
                                            _context4.prev = 1;
                                            _context4.next = 4;
                                            return _models["default"].error.create({
                                              type: 'lostNft',
                                              error: "".concat(err)
                                            });

                                          case 4:
                                            _context4.next = 9;
                                            break;

                                          case 6:
                                            _context4.prev = 6;
                                            _context4.t0 = _context4["catch"](1);
                                            console.log(_context4.t0);

                                          case 9:
                                          case "end":
                                            return _context4.stop();
                                        }
                                      }
                                    }, _callee4, null, [[1, 6]]);
                                  }));

                                  return function (_x5) {
                                    return _ref4.apply(this, arguments);
                                  };
                                }());

                              case 6:
                                _context7.next = 8;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                                    var rolesLost, checkUser, hasCripttyNFT, _yield$removeCripttyR3, _yield$removeCripttyR4, _yield$removeGeneralH3, _yield$removeGeneralH4;

                                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                                      while (1) {
                                        switch (_context5.prev = _context5.next) {
                                          case 0:
                                            rolesLost = [];
                                            _context5.next = 3;
                                            return _models["default"].user.findOne({
                                              where: {
                                                id: userWithNFT.id
                                              },
                                              include: [{
                                                model: _models["default"].nft,
                                                as: 'nfts',
                                                include: [{
                                                  model: _models["default"].nftCollection,
                                                  as: 'nftCollection'
                                                }]
                                              }],
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 3:
                                            checkUser = _context5.sent;
                                            hasCripttyNFT = checkUser.nfts.find(function (o) {
                                              console.log(o.nftCollection.name);
                                              console.log('---------------------------------');
                                              return o.nftCollection.name === 'criptty';
                                            });
                                            console.log(hasCripttyNFT);

                                            if (hasCripttyNFT) {
                                              _context5.next = 12;
                                              break;
                                            }

                                            _context5.next = 9;
                                            return (0, _removeCripttyRole.removeCripttyRole)(checkUser, member, rolesLost, t);

                                          case 9:
                                            _yield$removeCripttyR3 = _context5.sent;
                                            _yield$removeCripttyR4 = (0, _slicedToArray2["default"])(_yield$removeCripttyR3, 1);
                                            rolesLost = _yield$removeCripttyR4[0];

                                          case 12:
                                            if (checkUser.nfts) {
                                              _context5.next = 18;
                                              break;
                                            }

                                            _context5.next = 15;
                                            return (0, _removeGeneralHolderRole.removeGeneralHolderRole)(userWithNFT, member, rolesLost, t);

                                          case 15:
                                            _yield$removeGeneralH3 = _context5.sent;
                                            _yield$removeGeneralH4 = (0, _slicedToArray2["default"])(_yield$removeGeneralH3, 1);
                                            rolesLost = _yield$removeGeneralH4[0];

                                          case 18:
                                            if (!(rolesLost.length > 0)) {
                                              _context5.next = 21;
                                              break;
                                            }

                                            _context5.next = 21;
                                            return discordChannel.send({
                                              embeds: [(0, _embeds.userRolesLostMessage)(checkUser, rolesLost)]
                                            });

                                          case 21:
                                          case "end":
                                            return _context5.stop();
                                        }
                                      }
                                    }, _callee5);
                                  }));

                                  return function (_x6) {
                                    return _ref5.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                                      while (1) {
                                        switch (_context6.prev = _context6.next) {
                                          case 0:
                                            console.log(err);
                                            _context6.prev = 1;
                                            _context6.next = 4;
                                            return _models["default"].error.create({
                                              type: 'lostNft',
                                              error: "".concat(err)
                                            });

                                          case 4:
                                            _context6.next = 9;
                                            break;

                                          case 6:
                                            _context6.prev = 6;
                                            _context6.t0 = _context6["catch"](1);
                                            console.log(_context6.t0);

                                          case 9:
                                          case "end":
                                            return _context6.stop();
                                        }
                                      }
                                    }, _callee6, null, [[1, 6]]);
                                  }));

                                  return function (_x7) {
                                    return _ref6.apply(this, arguments);
                                  };
                                }());

                              case 8:
                                console.log(nft);
                                console.log('user nft');

                              case 10:
                              case "end":
                                return _context7.stop();
                            }
                          }
                        }, _loop2);
                      });
                      _iterator3 = _asyncIterator(userWithNFT.nfts);

                    case 19:
                      _context8.next = 21;
                      return _iterator3.next();

                    case 21:
                      if (!(_iteratorAbruptCompletion3 = !(_step3 = _context8.sent).done)) {
                        _context8.next = 26;
                        break;
                      }

                      return _context8.delegateYield(_loop2(), "t0", 23);

                    case 23:
                      _iteratorAbruptCompletion3 = false;
                      _context8.next = 19;
                      break;

                    case 26:
                      _context8.next = 32;
                      break;

                    case 28:
                      _context8.prev = 28;
                      _context8.t1 = _context8["catch"](16);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context8.t1;

                    case 32:
                      _context8.prev = 32;
                      _context8.prev = 33;

                      if (!(_iteratorAbruptCompletion3 && _iterator3["return"] != null)) {
                        _context8.next = 37;
                        break;
                      }

                      _context8.next = 37;
                      return _iterator3["return"]();

                    case 37:
                      _context8.prev = 37;

                      if (!_didIteratorError3) {
                        _context8.next = 40;
                        break;
                      }

                      throw _iteratorError3;

                    case 40:
                      return _context8.finish(37);

                    case 41:
                      return _context8.finish(32);

                    case 42:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _loop, null, [[16, 28, 32, 42], [33,, 37, 41]]);
            });
            _iterator = _asyncIterator(allUserWithNFT);

          case 17:
            _context13.next = 19;
            return _iterator.next();

          case 19:
            if (!(_iteratorAbruptCompletion = !(_step = _context13.sent).done)) {
              _context13.next = 24;
              break;
            }

            return _context13.delegateYield(_loop(), "t0", 21);

          case 21:
            _iteratorAbruptCompletion = false;
            _context13.next = 17;
            break;

          case 24:
            _context13.next = 30;
            break;

          case 26:
            _context13.prev = 26;
            _context13.t1 = _context13["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context13.t1;

          case 30:
            _context13.prev = 30;
            _context13.prev = 31;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context13.next = 35;
              break;
            }

            _context13.next = 35;
            return _iterator["return"]();

          case 35:
            _context13.prev = 35;

            if (!_didIteratorError) {
              _context13.next = 38;
              break;
            }

            throw _iteratorError;

          case 38:
            return _context13.finish(35);

          case 39:
            return _context13.finish(30);

          case 40:
            _context13.next = 42;
            return _models["default"].nft.findAll({
              include: [{
                model: _models["default"].nftCollection,
                as: 'nftCollection'
              }]
            });

          case 42:
            allNft = _context13.sent;
            _context13.next = 45;
            return _models["default"].linkedAddress.findAll({
              where: {
                verified: true,
                enabled: true
              },
              include: [{
                model: _models["default"].user,
                as: 'user'
              }]
            });

          case 45:
            allEnabledLinkedAddresses = _context13.sent;
            // Loop and do something if user owns the token
            _iteratorAbruptCompletion2 = false;
            _didIteratorError2 = false;
            _context13.prev = 48;
            _loop3 = /*#__PURE__*/_regenerator["default"].mark(function _loop3() {
              var nft, _loop4;

              return _regenerator["default"].wrap(function _loop3$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      nft = _step2.value;
                      _iteratorAbruptCompletion4 = false;
                      _didIteratorError4 = false;
                      _context12.prev = 3;
                      _loop4 = /*#__PURE__*/_regenerator["default"].mark(function _loop4() {
                        var linkedAddress, tokelPubkeyBalances, checkKeyPresenceInArray;
                        return _regenerator["default"].wrap(function _loop4$(_context11) {
                          while (1) {
                            switch (_context11.prev = _context11.next) {
                              case 0:
                                linkedAddress = _step4.value;
                                _context11.next = 3;
                                return (0, _rclient.getInstance)().tokenv2AllBalances(linkedAddress.pubKey);

                              case 3:
                                tokelPubkeyBalances = _context11.sent;
                                checkKeyPresenceInArray = tokelPubkeyBalances.some(function (obj) {
                                  return Object.keys(obj).includes(nft.tokenId);
                                });

                                if (!checkKeyPresenceInArray) {
                                  _context11.next = 8;
                                  break;
                                }

                                _context11.next = 8;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(t) {
                                    var rolesEarned, member, _yield$addGeneralHold, _yield$addGeneralHold2, _yield$addCripttyRole, _yield$addCripttyRole2;

                                    return _regenerator["default"].wrap(function _callee7$(_context9) {
                                      while (1) {
                                        switch (_context9.prev = _context9.next) {
                                          case 0:
                                            rolesEarned = [];

                                            if (!(!nft.userId || nft.userId !== linkedAddress.userId)) {
                                              _context9.next = 25;
                                              break;
                                            }

                                            _context9.next = 4;
                                            return guild.members.cache.get(linkedAddress.user.user_id);

                                          case 4:
                                            member = _context9.sent;
                                            _context9.next = 7;
                                            return nft.update({
                                              userId: linkedAddress.userId
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 7:
                                            console.log('after updateNft');
                                            _context9.next = 10;
                                            return (0, _addGeneralHolderRole.addGeneralHolderRole)(linkedAddress, member, rolesEarned, t);

                                          case 10:
                                            _yield$addGeneralHold = _context9.sent;
                                            _yield$addGeneralHold2 = (0, _slicedToArray2["default"])(_yield$addGeneralHold, 1);
                                            rolesEarned = _yield$addGeneralHold2[0];
                                            console.log('after addGeneralHolderRole');

                                            if (!(nft.nftCollection.name === 'criptty')) {
                                              _context9.next = 20;
                                              break;
                                            }

                                            _context9.next = 17;
                                            return (0, _addCripttyRole.addCripttyRole)(linkedAddress, member, rolesEarned, t);

                                          case 17:
                                            _yield$addCripttyRole = _context9.sent;
                                            _yield$addCripttyRole2 = (0, _slicedToArray2["default"])(_yield$addCripttyRole, 1);
                                            rolesEarned = _yield$addCripttyRole2[0];

                                          case 20:
                                            console.log('after addCripttyRole');
                                            console.log(rolesEarned);

                                            if (!(rolesEarned.length > 0)) {
                                              _context9.next = 25;
                                              break;
                                            }

                                            _context9.next = 25;
                                            return discordChannel.send({
                                              embeds: [(0, _embeds.userEarnedRolesMessage)(linkedAddress.user, rolesEarned)]
                                            });

                                          case 25:
                                          case "end":
                                            return _context9.stop();
                                        }
                                      }
                                    }, _callee7);
                                  }));

                                  return function (_x8) {
                                    return _ref7.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(err) {
                                    return _regenerator["default"].wrap(function _callee8$(_context10) {
                                      while (1) {
                                        switch (_context10.prev = _context10.next) {
                                          case 0:
                                            console.log(err);
                                            _context10.prev = 1;
                                            _context10.next = 4;
                                            return _models["default"].error.create({
                                              type: 'addRoleNFT',
                                              error: "".concat(err)
                                            });

                                          case 4:
                                            _context10.next = 9;
                                            break;

                                          case 6:
                                            _context10.prev = 6;
                                            _context10.t0 = _context10["catch"](1);
                                            console.log(_context10.t0);

                                          case 9:
                                          case "end":
                                            return _context10.stop();
                                        }
                                      }
                                    }, _callee8, null, [[1, 6]]);
                                  }));

                                  return function (_x9) {
                                    return _ref8.apply(this, arguments);
                                  };
                                }());

                              case 8:
                              case "end":
                                return _context11.stop();
                            }
                          }
                        }, _loop4);
                      });
                      _iterator4 = _asyncIterator(allEnabledLinkedAddresses);

                    case 6:
                      _context12.next = 8;
                      return _iterator4.next();

                    case 8:
                      if (!(_iteratorAbruptCompletion4 = !(_step4 = _context12.sent).done)) {
                        _context12.next = 13;
                        break;
                      }

                      return _context12.delegateYield(_loop4(), "t0", 10);

                    case 10:
                      _iteratorAbruptCompletion4 = false;
                      _context12.next = 6;
                      break;

                    case 13:
                      _context12.next = 19;
                      break;

                    case 15:
                      _context12.prev = 15;
                      _context12.t1 = _context12["catch"](3);
                      _didIteratorError4 = true;
                      _iteratorError4 = _context12.t1;

                    case 19:
                      _context12.prev = 19;
                      _context12.prev = 20;

                      if (!(_iteratorAbruptCompletion4 && _iterator4["return"] != null)) {
                        _context12.next = 24;
                        break;
                      }

                      _context12.next = 24;
                      return _iterator4["return"]();

                    case 24:
                      _context12.prev = 24;

                      if (!_didIteratorError4) {
                        _context12.next = 27;
                        break;
                      }

                      throw _iteratorError4;

                    case 27:
                      return _context12.finish(24);

                    case 28:
                      return _context12.finish(19);

                    case 29:
                    case "end":
                      return _context12.stop();
                  }
                }
              }, _loop3, null, [[3, 15, 19, 29], [20,, 24, 28]]);
            });
            _iterator2 = _asyncIterator(allNft);

          case 51:
            _context13.next = 53;
            return _iterator2.next();

          case 53:
            if (!(_iteratorAbruptCompletion2 = !(_step2 = _context13.sent).done)) {
              _context13.next = 58;
              break;
            }

            return _context13.delegateYield(_loop3(), "t2", 55);

          case 55:
            _iteratorAbruptCompletion2 = false;
            _context13.next = 51;
            break;

          case 58:
            _context13.next = 64;
            break;

          case 60:
            _context13.prev = 60;
            _context13.t3 = _context13["catch"](48);
            _didIteratorError2 = true;
            _iteratorError2 = _context13.t3;

          case 64:
            _context13.prev = 64;
            _context13.prev = 65;

            if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
              _context13.next = 69;
              break;
            }

            _context13.next = 69;
            return _iterator2["return"]();

          case 69:
            _context13.prev = 69;

            if (!_didIteratorError2) {
              _context13.next = 72;
              break;
            }

            throw _iteratorError2;

          case 72:
            return _context13.finish(69);

          case 73:
            return _context13.finish(64);

          case 74:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee9, null, [[14, 26, 30, 40], [31,, 35, 39], [48, 60, 64, 74], [65,, 69, 73]]);
  }));
  return _startNftCheck.apply(this, arguments);
}