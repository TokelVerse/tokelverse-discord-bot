import db from '../../models';
import {
  userNotFoundMessage,
} from '../../embeds';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const userWalletExist = async (
  message,
  functionName,
  t,
) => {
  let activity;
  let userId;
  if (message.user && message.user.id) {
    userId = message.user.id;
  } else if (message.author) {
    userId = message.author.id;
  } else {
    userId = message.user;
  }

  const user = await db.user.findOne({
    where: {
      user_id: `${userId}`,
    },
    include: [
      {
        model: db.wallet,
        as: 'wallet',
        required: true,
        include: [
          {
            model: db.address,
            as: 'address',
            required: true,
          },
        ],
      },
    ],
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (!user) {
    activity = await db.activity.create({
      type: `${functionName}_f`,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await message.reply({
      embeds: [
        userNotFoundMessage(
          userId,
          capitalize(functionName),
        ),
      ],
    });
  }
  console.log(user);
  return [
    user,
    activity,
  ];
};
