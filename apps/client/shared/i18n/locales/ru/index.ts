import admin from './admin.json';
import app from './app.json';
import auth from './auth.json';
import common from './common.json';
import marketing from './marketing.json';
import room from './room.json';
import server from './server.json';
import social from './social.json';

export const ru = {
  ...common,
  ...auth,
  ...room,
  ...server,
  ...social,
  ...app,
  ...admin,
  ...marketing
};
