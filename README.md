## SUPPORTED .ENV CURRENCY_NAME LIST (Case sensitive, default fallback is Runebase config)
- Runebase
- Pirate
- Dust

# SETUP

##Create .env

```
#RPC
RPC_USER=runebaseinfo
RPC_PASS=runebaseinfo
RPC_PORT=9432

#DATABASE
DB_NAME=runestip
DB_USER=newuser
DB_PASS=@123TestDBFo
DB_HOST=localhost
DB_PORT=3306

## DISCORD
DISCORD_CLIENT_TOKEN=xx

#SESSION DASHBOARD
SESSION_SECRET="xxx"

#EMAIL
MAIL_HOST=mail.xxx.io
MAIL_PORT=587
MAIL_USER=xx@xx.com
MAIL_PASS=xx

#RECAPTCHA
RECAPTCHA_SITE_KEY=xx
RECAPTCHA_SECRET_KEY=xx

#ROOT_URL
ROOT_URL=localhost

```
## Create database mysql terminal
```
CREATE DATABASE runestip;

GRANT ALL ON runestip.* TO 'newuser'@'localhost';

FLUSH PRIVILEGES;
```

## Migrations

run migrations
````
npx sequelize-cli db:migrate
````

generate a new empty migration file
````
npx sequelize-cli migration:generate --name Sleet-table

````

undo single migration
````
npx sequelize-cli db:migrate:undo --name 20211208092519-Add-user-association-to-features.js

````

undo migration
````
npx sequelize-cli db:migrate:undo
````

deploy demo seeds (development only)
````
npx sequelize-cli db:seed:all
````

generte empty seed file
````
npx sequelize-cli seed:generate --name demo-jackpot
````



## Tokel Node Config
```
rpcuser=xx
rpcpassword=xx
rpcport=29405
server=1
txindex=1
rpcworkqueue=256
rpcallowip=127.0.0.1
rpcbind=127.0.0.1
blocknotify=curl --header "Content-Type: application/json" --request POST --data "{ \"payload\" : \"%s\", \"ticker\" : \"TKL\"}" http://127.0.0.1:8080/api/rpc/blocknotify
walletnotify=curl --header "Content-Type: application/json" --request POST --data "{ \"payload\" : \"%s\", \"ticker\" : \"TKL\"}" http://127.0.0.1:8080/api/rpc/walletnotify
daemon=1

```

## Read this

https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

https://choosealicense.com/no-permission/

## Contact

If you want host this tipbot yourself, you must ask the developer for permission.

If you want the developer to host this tipbot for your project and have your project integrated, you can apply in the appropriate channel on discord

join the discord:
https://discord.gg/CdUSaVfp8Q
