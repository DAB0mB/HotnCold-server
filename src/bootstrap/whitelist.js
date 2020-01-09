import { provideWhitelist } from '../providers';

const bootstrapWhitelist = async () => {
  const Spreadsheet = require('google-spreadsheet');
  const { Whitelist } = require('../services');

  const doc = new Spreadsheet(process.env.WHITELIST_SHEET_ID);

  await new Promise((resolve, reject) => {
    doc.useServiceAccountAuth({
      client_email: process.env.SHEETS_CLIENT_EMAIL,
      private_key: process.env.SHEETS_PRIVATE_KEY
    }, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });

  const sheet = await new Promise((resolve, reject) => {
    doc.getInfo((err, info) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(info.worksheets[0]);
      }
    });
  });

  const whitelist = new Whitelist(sheet);

  provideWhitelist(whitelist);
};

export default bootstrapWhitelist;
