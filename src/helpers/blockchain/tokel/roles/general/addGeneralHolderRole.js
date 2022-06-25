import db from '../../../../../models';

export const addGeneralHolderRole = async (
  linkedAddress,
  member,
  rolesEarned,
  t,
) => {
  console.log(linkedAddress);
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
      userId: linkedAddress.user.id,
      roleId: findGeneralHolderRole.id,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  console.log('4');
  if (!findUserRoleGeneralHolder) {
    await db.UserRole.create({
      userId: linkedAddress.user.id,
      roleId: findGeneralHolderRole.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!member.roles.cache.has(findGeneralHolderRole.discordRoleId)) {
      await member.roles.add(findGeneralHolderRole.discordRoleId);
    }
    rolesEarned.push(findGeneralHolderRole.discordRoleId);
  }
  console.log('5');
  return [
    rolesEarned,
  ];
};
