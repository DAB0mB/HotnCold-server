import jwt from 'jsonwebtoken';

import { useModels, useTwilio } from '../providers';
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
      phone = phone[0] + phone.replace(/[^\d]/g, '');

      const defaults = {
        verified: false,
        phone,
        passcode,
      };

      if (phone.match(process.env.TEST_PHONE_LOCAL)) {
        const contract = await Contract.create({
          ...defaults,
          isTest: true,
        });

        return contract;
      }

      let isTestPhone;
      if (phone.match(process.env.TEST_PHONE_SMS)) {
        isTestPhone = true;
        phone = `+${phone.slice(1)}`;
        defaults.phone = phone;
        defaults.isTest = true;
      }

      const area = await Area.findByCountryCode(phone);

      if (!area) {
        throw Error('Country is not yet supported');
      }

      let contract;
      let passcodePhrase;
      if (isTestPhone) {
        contract = await Contract.create(defaults);
        passcodePhrase = 'test passcode';
      }
      else {
        contract = await Contract.findOrCreate({
          where: { phone },
          defaults,
        });
        passcodePhrase = 'passcode';
      }

      await twilio.messages.create({
        body: `Hot&Cold ${passcodePhrase}: ${passcode}`,
        from: area.phone,
        to: phone,
      });

      return contract;
    },

    async verifyContract(mutation, { contractId, passcode }, { res }) {
      const { Contract } = useModels();

      const contract = await Contract.findOne({
        id: contractId,
        updatedAt: { $gt: new Date(Date.now() - Number(process.env.OTP_TIMEOUT)) },
        passcode,
      });

      if (!contract) {
        throw Error('Passcode is incorrect');
      }

      contract.verified = true;
      await contract.save();

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
