import db from '../../../../../models';

export const removeGeneralHolderRole = async (
  userWithNFT,
  member,
  rolesLost,
  t,
) => {
  const findGeneralHolderRole = await db.role.findOne({
    where: {
      name: 'General holder',
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  console.log(findGeneralHolderRole);
  console.log('findGeneralHolderRole');
  const findUserRoleGeneralHolder = await db.UserRole.findOne({
    where: {
      userId: userWithNFT.id,
      roleId: findGeneralHolderRole.id,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (findUserRoleGeneralHolder) {
    await findUserRoleGeneralHolder.destroy({
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }
  if (member.roles.cache.has(findGeneralHolderRole.discordRoleId)) {
    await member.roles.remove(findGeneralHolderRole.discordRoleId);
    rolesLost.push(findGeneralHolderRole.discordRoleId);
  }

  return [
    rolesLost,
  ];
};
