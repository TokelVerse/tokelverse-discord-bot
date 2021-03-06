import { Op } from 'sequelize';
import db from '../../models';

export const banServer = async (
  req,
  res,
  next,
) => {
  const group = await db.group.findOne({
    where: {
      id: req.body.id,
    },
  });
  res.locals.name = 'banServer';
  res.locals.result = await group.update({
    banned: !group.banned,
    banMessage: req.body.banMessage,
  });

  next();
};

export const fetchServers = async (req, res, next) => {
  const userOptions = {};
  if (req.body.platform !== 'all') {
    if (req.body.platform === 'telegram') {
      userOptions.groupId = { [Op.startsWith]: 'telegram-' };
    }
    if (req.body.platform === 'discord') {
      userOptions.groupId = { [Op.startsWith]: 'discord-' };
    }
  }
  if (req.body.id !== '') {
    userOptions.id = Number(req.body.id);
  }
  if (req.body.groupId !== '') {
    userOptions.groupId = req.body.groupId;
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    where: userOptions,
  };

  res.locals.name = 'server';
  res.locals.count = await db.group.count(options);
  res.locals.result = await db.group.findAll(options);
  next();
};
