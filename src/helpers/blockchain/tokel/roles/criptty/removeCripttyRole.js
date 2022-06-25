import db from '../../../../../models';

export const removeCripttyRole = async (
  userWithNFT,
  member,
  rolesLost,
  t,
) => {
  const findCrypttiHolderRole = await db.role.findOne({
    where: {
      name: 'Criptty holder',
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  const findUserRoleCrypttiHolder = await db.UserRole.findOne({
    where: {
      userId: userWithNFT.id,
      roleId: findCrypttiHolderRole.id,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (findUserRoleCrypttiHolder) {
    await findUserRoleCrypttiHolder.destroy({
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }
  if (member.roles.cache.has(findCrypttiHolderRole.discordRoleId)) {
    await member.roles.remove(findCrypttiHolderRole.discordRoleId);
    rolesLost.push(findCrypttiHolderRole.discordRoleId);
  }

  return [
    rolesLost,
  ];
};
