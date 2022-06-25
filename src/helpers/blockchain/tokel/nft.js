/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import db from '../../../models';
import {
  userEarnedRolesMessage,
  userUnlinkedAddressRolesLostMessage,
  userRolesLostMessage,
} from '../../../messages';
import { getInstance } from "../../../services/rclient";
import { addCripttyRole } from './roles/criptty/addCripttyRole';
import { removeCripttyRole } from './roles/criptty/removeCripttyRole';
import { addGeneralHolderRole } from './roles/general/addGeneralHolderRole';
import { removeGeneralHolderRole } from './roles/general/removeGeneralHolderRole';

export async function startNftCheck(
  discordClient,
) {
  const setting = await db.setting.findOne();
  const discordChannel = await discordClient.channels.cache.get(setting.expRewardChannelId);
  const guild = await discordClient.guilds.cache.get(setting.discordHomeServerGuildId);

  // REMOVE NFT ROLES

  const allUserWithNFT = await db.user.findAll({
    include: [
      {
        model: db.nft,
        as: 'nfts',
        required: true,
      },
      {
        model: db.linkedAddress,
        as: 'linkedAddress',
        required: false,
        where: {
          enabled: true,
          verified: true,
        },
      },
    ],
  });

  for await (const userWithNFT of allUserWithNFT) {
    console.log(userWithNFT.linkedAddress);
    console.log('user linked address');
    const member = await guild.members.cache.get(userWithNFT.user_id);
    if (!userWithNFT.linkedAddress) {
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        console.log('user unlinked his address therefor he loses all roles');
        for await (const nft of userWithNFT.nfts) {
          await nft.update({
            userId: null,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
        }
        let rolesLost = [];

        [
          rolesLost,
        ] = await removeGeneralHolderRole(
          userWithNFT,
          member,
          rolesLost,
          t,
        );
        [
          rolesLost,
        ] = await removeCripttyRole(
          userWithNFT,
          member,
          rolesLost,
          t,
        );
        console.log(rolesLost);
        if (rolesLost.length > 0) {
          await discordChannel.send({
            embeds: [
              userUnlinkedAddressRolesLostMessage(
                userWithNFT,
                rolesLost,
              ),
            ],
          });
        }
      }).catch(async (err) => {
        console.log(err);
        try {
          await db.error.create({
            type: 'unlinkedAddressLoseNft',
            error: `${err}`,
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
    // check if user still owns NFT here
    let tokelPubkeyBalances;
    if (userWithNFT.linkedAddress) {
      tokelPubkeyBalances = await getInstance().tokenv2AllBalances(userWithNFT.linkedAddress.pubKey);
    }

    for await (const nft of userWithNFT.nfts) {
      if (tokelPubkeyBalances) {
        const checkKeyPresenceInArray = tokelPubkeyBalances.some((obj) => Object.keys(obj).includes(nft.tokenId));
        if (
          !checkKeyPresenceInArray
        ) {
          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          }, async (t) => {
            await nft.update({
              userId: null,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
          }).catch(async (err) => {
            console.log(err);
            try {
              await db.error.create({
                type: 'lostNft',
                error: `${err}`,
              });
            } catch (e) {
              console.log(e);
            }
          });
        }
      }

      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        let rolesLost = [];
        const checkUser = await db.user.findOne({
          where: {
            id: userWithNFT.id,
          },
          include: [
            {
              model: db.nft,
              as: 'nfts',
              include: [
                {
                  model: db.nftCollection,
                  as: 'nftCollection',
                },
              ],
            },
          ],
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        const hasCripttyNFT = checkUser.nfts.find((o) => {
          console.log(o.nftCollection.name);
          console.log('---------------------------------');
          return o.nftCollection.name === 'criptty';
        });
        console.log(hasCripttyNFT);
        if (!hasCripttyNFT) {
          [
            rolesLost,
          ] = await removeCripttyRole(
            checkUser,
            member,
            rolesLost,
            t,
          );
        }
        if (!checkUser.nfts) {
          [
            rolesLost,
          ] = await removeGeneralHolderRole(
            userWithNFT,
            member,
            rolesLost,
            t,
          );
        }
        if (rolesLost.length > 0) {
          await discordChannel.send({
            embeds: [
              userRolesLostMessage(
                checkUser,
                rolesLost,
              ),
            ],
          });
        }
      }).catch(async (err) => {
        console.log(err);
        try {
          await db.error.create({
            type: 'lostNft',
            error: `${err}`,
          });
        } catch (e) {
          console.log(e);
        }
      });

      console.log(nft);
      console.log('user nft');
    }
  }

  // ADD NFT ROLES
  const allNft = await db.nft.findAll({
    include: [
      {
        model: db.nftCollection,
        as: 'nftCollection',
      },
    ],
  });

  const allEnabledLinkedAddresses = await db.linkedAddress.findAll({
    where: {
      verified: true,
      enabled: true,
    },
    include: [
      {
        model: db.user,
        as: 'user',
      },
    ],
  });

  // Loop and do something if user owns the token
  for await (const nft of allNft) {
    for await (const linkedAddress of allEnabledLinkedAddresses) {
      const tokelPubkeyBalances = await getInstance().tokenv2AllBalances(linkedAddress.pubKey);
      const checkKeyPresenceInArray = tokelPubkeyBalances.some((obj) => Object.keys(obj).includes(nft.tokenId));
      if (checkKeyPresenceInArray) {
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        }, async (t) => {
          let rolesEarned = [];
          if (
            !nft.userId
            || nft.userId !== linkedAddress.userId
          ) {
            const member = await guild.members.cache.get(linkedAddress.user.user_id);
            await nft.update({
              userId: linkedAddress.userId,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            console.log('after updateNft');
            [
              rolesEarned,
            ] = await addGeneralHolderRole(
              linkedAddress,
              member,
              rolesEarned,
              t,
            );
            console.log('after addGeneralHolderRole');
            if (nft.nftCollection.name === 'criptty') {
              [
                rolesEarned,
              ] = await addCripttyRole(
                linkedAddress,
                member,
                rolesEarned,
                t,
              );
            }
            console.log('after addCripttyRole');
            console.log(rolesEarned);
            if (rolesEarned.length > 0) {
              await discordChannel.send({
                embeds: [
                  userEarnedRolesMessage(
                    linkedAddress.user,
                    rolesEarned,
                  ),
                ],
              });
            }
          }
        }).catch(async (err) => {
          console.log(err);
          try {
            await db.error.create({
              type: 'addRoleNFT',
              error: `${err}`,
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
    }
  }
}
