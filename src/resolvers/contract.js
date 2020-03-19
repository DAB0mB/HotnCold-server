import jwt from 'jsonwebtoken';

import { useModels, useTwilio, useWhitelist } from '../providers';
import { generatePasscode } from '../utils';

const resolvers = {
  Query: {
    myContract(query, args, { myContract }) {
      return myContract;
    },
  },

  Mutation: {
    async findOrCreateContract(mutation, { phone }) {
      const { Area, Contract } = useModels();
      const twilio = useTwilio();
      const passcode = generatePasscode();
      const passcodeExpiresAt = new Date(Date.now() + Number(process.env.OTP_TIMEOUT));
      phone = phone[0] + phone.replace(/[^\d]/g, '');

      const defaults = {
        signed: false,
        phone,
        passcode,
        passcodeExpiresAt,
      };

      if (new RegExp(process.env.TEST_PHONE_LOCAL).test(phone)) {
        const contract = await Contract.create({
          ...defaults,
          isTest: true,
        });

        return contract;
      }

      let isTestPhone;
      if (new RegExp(process.env.TEST_PHONE_SMS).test(phone)) {
        isTestPhone = true;
        phone = `+${phone.slice(1)}`;
        defaults.phone = phone;
        defaults.isTest = true;
      }

      if (process.env.WHITELIST_SHEET_ID) {
        const whitelist = useWhitelist();

        if (!await whitelist.hasPhone(phone)) {
          throw Error('Phone is not invited');
        }
      }

      const area = await Area.findByCountryCode(phone);

      if (!area) {
        throw Error('Country is not yet supported');
      }

      let created;
      let contract;
      let passcodePhrase;
      if (isTestPhone) {
        contract = await Contract.create(defaults);
        passcodePhrase = 'test passcode';
      }
      else {
        [contract, created] = await Contract.findOrCreate({
          where: { phone },
          defaults,
        });
        passcodePhrase = 'passcode';
      }

      if (!created) {
        contract.passcode = passcode;
        contract.passcodeExpiresAt = passcodeExpiresAt;
        await contract.save();
      }

      if (!process.env.TWILIO_SKIP) {
        await twilio.messages.create({
          body: `Hot&Cold ${passcodePhrase}: ${passcode}`,
          from: area.phone,
          to: phone,
        });
      }

      return contract;
    },

    async verifyContract(mutation, { contractId, passcode }, { res }) {
      const { Contract } = useModels();

      const contract = await Contract.findOne({
        where: {
          id: contractId,
          passcodeExpiresAt: { $gte: new Date() },
          passcode,
        },
      });

      if (!contract) {
        throw Error('Passcode is incorrect or timed-out');
      }

      const authToken = await new Promise((resolve, reject) => {
        jwt.sign(contract.id, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, token) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(token);
          }
        });
      });

      res.cookie('authToken', authToken);

      return contract;
    },
  },

  Contract: {
    passcode(contract) {
      if (contract.isTest) {
        return contract.passcode;
      }
    },
  },
};

export default resolvers;
