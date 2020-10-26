import { serialize as serializeCookie } from 'cookie';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { phoneLocalPattern, phoneSmsPattern } from '../consts';
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
      const passcodeExpiresAt = new Date(Date.now() + Number(process.env.OTP_TIMEOUT));
      phone = phone[0] + phone.replace(/[^\d]/g, '');

      const defaults = {
        signed: false,
        phone,
        passcode,
        passcodeExpiresAt,
      };

      if (phoneLocalPattern.test(phone)) {
        const contract = await Contract.create({
          ...defaults,
          isTest: true,
        });

        return contract;
      }

      let isTestPhone;
      if (phoneSmsPattern.test(phone)) {
        isTestPhone = true;
        phone = `+${phone.slice(1)}`;
        defaults.phone = phone;
        defaults.isTest = true;
      }

      const area = await Area.findByCountryCode(phone);
      const areaPhone = area ? area.phone : Area.defaultPhone;

      // if (!area) {
      //   throw Error('Country is not yet supported');
      // }

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

      if (process.env.TWILIO_SKIP) {
        console.log({
          body: `Hot&Cold ${passcodePhrase}: ${passcode}`,
          from: areaPhone,
          to: phone,
        });
      }
      else {
        await twilio.messages.create({
          body: `Hot&Cold ${passcodePhrase}: ${passcode}`,
          from: areaPhone,
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
          passcodeExpiresAt: { [Op.gte]: new Date() },
          passcode,
        },
      });

      if (!contract) {
        throw Error('Passcode is incorrect or timed-out');
      }

      const expires = new Date(Date.now() + Number(process.env.AUTH_TTL) * 60000);

      const authToken = await new Promise((resolve, reject) => {
        jwt.sign({
          contractId: contract.id,
          expires: expires.toString(),
        }, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, token) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(token);
          }
        });
      });

      res.setHeader('Set-Cookie', serializeCookie('authToken', authToken, { expires }));

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
