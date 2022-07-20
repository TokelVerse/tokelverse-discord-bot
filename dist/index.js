"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _pQueue = _interopRequireDefault(require("p-queue"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _compression = _interopRequireDefault(require("compression"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _helmet = _interopRequireDefault(require("helmet"));

var _dotenv = require("dotenv");

var _passport = _interopRequireDefault(require("passport"));

var _connectRedis = _interopRequireDefault(require("connect-redis"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _redis = require("redis");

var _socket = _interopRequireDefault(require("socket.io"));

var _csurf = _interopRequireDefault(require("csurf"));

var _path = _interopRequireDefault(require("path"));

var _canvas = require("canvas");

var _router = require("./router");

var _router2 = require("./dashboard/router");

var _initDatabaseRecords = require("./helpers/initDatabaseRecords");

var _syncTokel = require("./services/syncTokel");

var _patcher = require("./helpers/blockchain/tokel/patcher");

var _nft = require("./helpers/blockchain/tokel/nft");

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _settings = _interopRequireDefault(require("./config/settings"));

var _deployCommands = require("./helpers/client/deployCommands");

/* eslint-disable import/first */
Object.freeze(Object.prototype);
(0, _dotenv.config)();
(0, _canvas.registerFont)(_path["default"].join(__dirname, './assets/fonts/', 'Heart_warming.otf'), {
  family: 'HeartWarming'
});

var checkCSRFRoute = function checkCSRFRoute(req) {
  var hostmachine = req.headers.host.split(':')[0];

  if (req.url === '/api/rpc/blocknotify' && (hostmachine === 'localhost' || hostmachine === '127.0.0.1') || req.url === '/api/rpc/walletnotify' && (hostmachine === 'localhost' || hostmachine === '127.0.0.1')) {
    return true;
  }

  return false;
};

var conditionalCSRF = function conditionalCSRF(req, res, next) {
  var shouldPass = checkCSRFRoute(req);

  if (shouldPass) {
    return next();
  }

  return (0, _csurf["default"])({
    cookie: {
      secure: true,
      maxAge: 3600
    }
  })(req, res, next);
};

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var queue, port, app, server, io, RedisStore, redisClient, sessionMiddleware, wrap, sockets, discordClient, schedulePatchDeposits, scheduleNftCheck;
  return _regenerator["default"].wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          queue = new _pQueue["default"]({
            concurrency: 1,
            timeout: 1000000000
          });
          port = process.env.PORT || 8080;
          app = (0, _express["default"])();
          server = _http["default"].createServer(app);
          io = (0, _socket["default"])(server, {
            path: '/socket.io',
            cookie: false
          });
          app.use((0, _helmet["default"])());
          app.use((0, _compression["default"])());
          app.use((0, _morgan["default"])('combined'));
          app.use((0, _cors["default"])());
          app.set('trust proxy', 1);
          RedisStore = (0, _connectRedis["default"])(_expressSession["default"]);
          redisClient = (0, _redis.createClient)({
            database: 3,
            legacyMode: true
          });
          _context2.next = 14;
          return redisClient.connect();

        case 14:
          sessionMiddleware = (0, _expressSession["default"])({
            secret: process.env.SESSION_SECRET,
            key: "connect.sid",
            resave: false,
            proxy: true,
            saveUninitialized: false,
            ephemeral: false,
            store: new RedisStore({
              client: redisClient
            }),
            cookie: {
              httpOnly: true,
              secure: true,
              sameSite: 'strict'
            }
          });
          app.use((0, _cookieParser["default"])());
          app.use(_bodyParser["default"].urlencoded({
            extended: false,
            limit: '5mb'
          }));
          app.use(_bodyParser["default"].json());
          app.use(conditionalCSRF);
          app.use(function (req, res, next) {
            var shouldPass = checkCSRFRoute(req);

            if (shouldPass) {
              return next();
            }

            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
          });
          app.use(sessionMiddleware);
          app.use(_passport["default"].initialize());
          app.use(_passport["default"].session());

          wrap = function wrap(middleware) {
            return function (socket, next) {
              return middleware(socket.request, {}, next);
            };
          };

          io.use(wrap(sessionMiddleware));
          io.use(wrap(_passport["default"].initialize()));
          io.use(wrap(_passport["default"].session()));
          sockets = {};
          io.on("connection", /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket) {
              var userId;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      userId = socket.request.session.passport ? socket.request.session.passport.user : '';

                      if (socket.request.user && (socket.request.user.role === 4 || socket.request.user.role === 8)) {
                        socket.join('admin');
                        sockets[parseInt(userId, 10)] = socket;
                      } // console.log(Object.keys(sockets).length);


                      socket.on("disconnect", function () {
                        delete sockets[parseInt(userId, 10)];
                      });

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }());
          discordClient = new _discord.Client({
            intents: [_discord.GatewayIntentBits.Guilds, _discord.GatewayIntentBits.GuildMembers, _discord.GatewayIntentBits.GuildMessages, _discord.GatewayIntentBits.DirectMessages, _discord.GatewayIntentBits.GuildMessageReactions, _discord.GatewayIntentBits.DirectMessageReactions, _discord.GatewayIntentBits.GuildEmojisAndStickers, _discord.GatewayIntentBits.GuildVoiceStates, _discord.GatewayIntentBits.MessageContent, _discord.GatewayIntentBits.GuildPresences, _discord.GatewayIntentBits.GuildInvites // GatewayIntentBits.
            ],
            partials: [_discord.Partials.Message, _discord.Partials.Channel, _discord.Partials.Reaction]
          });
          _context2.next = 32;
          return (0, _router.router)(app, discordClient, io, queue);

        case 32:
          _context2.next = 34;
          return discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

        case 34:
          console.log("Logged in as ".concat(discordClient.user.tag, "!"));
          discordClient.user.setPresence({
            activities: [{
              name: "".concat(_settings["default"].bot.command),
              type: "PLAYING"
            }]
          });
          (0, _router2.dashboardRouter)(app, io, discordClient);
          _context2.next = 39;
          return (0, _initDatabaseRecords.initDatabaseRecords)(discordClient);

        case 39:
          _context2.next = 41;
          return (0, _deployCommands.deployCommands)(process.env.DISCORD_CLIENT_TOKEN, discordClient.user.id);

        case 41:
          _context2.next = 43;
          return (0, _syncTokel.startTokelSync)(discordClient, io, queue);

        case 43:
          _context2.next = 45;
          return (0, _patcher.patchTokelDeposits)(discordClient);

        case 45:
          schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchTokelDeposits)(discordClient);
          });
          (0, _nft.startNftCheck)(discordClient);
          scheduleNftCheck = _nodeSchedule["default"].scheduleJob('*/15 * * * *', function () {
            (0, _nft.startNftCheck)(discordClient);
          });
          app.use(function (err, req, res, next) {
            res.status(500).send({
              error: err.message
            });
          });
          server.listen(port);
          console.log('server listening on:', port);

        case 51:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))();
process.on('unhandledRejection', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err, p) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].error("Error Application Unhandled Rejection: ".concat(err));

            console.log(err, '\nUnhandled Rejection at Promise\n', p, '\n--------------------------------');
            console.log(err.stack);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}());
process.on('uncaughtException', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err, p) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _logger["default"].error("Error Application Uncaught Exception: ".concat(err));

            console.log(err, '\nUnhandled Exception at Promise\n', p, '\n--------------------------------');
            console.log(err.stack);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}());