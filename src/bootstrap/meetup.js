import { provideMeetup } from '../providers';

const bootstrapMeetup = () => {
  const Meetup = require('../services/meetup').default;

  const meetup = new Meetup({
    key: process.env.MEETUP_CONSUMER_KEY,
    secret: process.env.MEETUP_CONSUMER_SECRET,
    redirectUri: process.env.MEETUP_CONSUMER_REDIRECT_URI,
  }, {
    email: process.env.MEETUP_USER_MAIL,
    password: process.env.MEETUP_USER_PASS,
  });

  provideMeetup(meetup);
};

export default bootstrapMeetup;
