# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.7](https://github.com/TokelVerse/tokelverse-discord-bot/compare/v0.0.6...v0.0.7) (2022-08-06)


### Bug Fixes

* 🚑️ Fix all controllers to work with slash commands and text prefix, fix router, fix catch, helper fetchChannel & userId, fix catch ([0c4d28e](https://github.com/TokelVerse/tokelverse-discord-bot/commit/0c4d28eec685a12207bb5b31d262da0439519d44))


### Refactor

* ⚰️ remove unused registery and dead commented code ([d28b72e](https://github.com/TokelVerse/tokelverse-discord-bot/commit/d28b72e21fe5ca1f3abf7836273b894382c6e61a))
* **deployCommands:** ♻️ use subcommands with prefix bot command instead of many commands ([5b52191](https://github.com/TokelVerse/tokelverse-discord-bot/commit/5b52191bda367b38bdd6b095474cc011ff817288))


### Style

* **embeds:** 🎨 adjust command shown in embed messages ([b216ffb](https://github.com/TokelVerse/tokelverse-discord-bot/commit/b216ffb9e1cc8dd70d81709c36a424e417bde347))


### Build

* seperate development seeds from production seeds with npm scripts ([bd8bc13](https://github.com/TokelVerse/tokelverse-discord-bot/commit/bd8bc13671fd2ef6a7bc471421a9e9bb4cbac289))

### [0.0.6](https://github.com/TokelVerse/tokelverse-discord-bot/compare/v0.0.5...v0.0.6) (2022-08-05)


### Bug Fixes

* add disabled feature messages ([98cb9e8](https://github.com/TokelVerse/tokelverse-discord-bot/commit/98cb9e8ff09d613081c9c5b4a66981cd7622b50c))
* **embeds:** ✏️ show correct prefix command in welcome message ([624a421](https://github.com/TokelVerse/tokelverse-discord-bot/commit/624a421f0c575a5bfbb460d318583f91caa101cf))
* **embeds:** add disabled feature messages ([7381c6e](https://github.com/TokelVerse/tokelverse-discord-bot/commit/7381c6e3f8a65500181a4819205be2068aaa262d))


### Refactor

* **userWalletExists:** ♻️ db transaction object as last argument ([0dfbe17](https://github.com/TokelVerse/tokelverse-discord-bot/commit/0dfbe177276ce79a1494550f14e54b2f3a4a4417))

### [0.0.5](https://github.com/TokelVerse/tokelverse-discord-bot/compare/v0.0.4...v0.0.5) (2022-08-05)


### Bug Fixes

* **topggVote:** 🐛 disable CSRF token check for topgg voting ([616e3ee](https://github.com/TokelVerse/tokelverse-discord-bot/commit/616e3eefefca384e84603f1307aa01a99bcddf1e))

### [0.0.4](https://github.com/TokelVerse/tokelverse-discord-bot/compare/v0.0.3...v0.0.4) (2022-08-05)


### Bug Fixes

* **topggVote:** 🐛 load dotenv config ([6c90b4a](https://github.com/TokelVerse/tokelverse-discord-bot/commit/6c90b4a05d8d737ae6f6bc87a05ec500be6e076f))

### 0.0.3 (2022-08-05)


### Features

* **topggVote:** ✨ Add topGGVote controller and webhook route ([2559adb](https://github.com/TokelVerse/tokelverse-discord-bot/commit/2559adbe5262f4d7a88402309770ce358501c81d))


### Bug Fixes

* **deployCommands:** :adhesive_bandage: use discord-api v10 ([63016ed](https://github.com/TokelVerse/tokelverse-discord-bot/commit/63016ed64d8736b7fd610c1807faca1b11552096))


### Build

* **package.json:** :package: add release & versionControl dependencies, method ([6500f93](https://github.com/TokelVerse/tokelverse-discord-bot/commit/6500f936612cfd1670f28942ffb742150b3e3267))
