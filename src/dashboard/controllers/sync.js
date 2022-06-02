import settings from '../../config/settings';
import { startKomodoSync } from "../../services/syncTokel";



export const startSyncBlocks = async (
  req,
  res,
  next,
) => {

  startKomodoSync();

  res.locals.name = 'sync';
  res.locals.result = 'TRUE';
  next();
};
