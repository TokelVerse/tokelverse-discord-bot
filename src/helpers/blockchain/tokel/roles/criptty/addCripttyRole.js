import db from '../../../../../models';

export const addCripttyRole = async (
  linkedAddress,
  member,
  rolesEarned,
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
      userId: linkedAddress.user.id,
      roleId: findCrypttiHolderRole.id,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (!findUserRoleCrypttiHolder) {
    await db.UserRole.create({
      userId: linkedAddress.user.id,
      roleId: findCrypttiHolderRole.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!member.roles.cache.has(findCrypttiHolderRole.discordRoleId)) {
      await member.roles.add(findCrypttiHolderRole.discordRoleId);
    }
    rolesEarned.push(findCrypttiHolderRole.discordRoleId);
  }
  return [
    rolesEarned,
  ];
};
