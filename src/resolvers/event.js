import { useMeetup } from '../providers';

const resolvers = {
  Query: {
    async eventDescription(query, { eventSource, eventId, urlname }) {
      const meetup = useMeetup();

      if (eventSource == 'meetup') {
        if (!urlname) {
          throw Error('Variable "urlname" was not provided');
        }

        const event = await meetup.getEvent(urlname, eventId, {
          only: 'description',
        });

        return event.description;
      }

      return '';
    },
  },
};

export default resolvers;
