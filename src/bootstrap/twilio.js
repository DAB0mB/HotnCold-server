import Twilio from 'twilio';

import { provideTwilio } from '../providers';

const bootstrapTwilio = async () => {
  const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  provideTwilio(twilio);
};

export default bootstrapTwilio;
