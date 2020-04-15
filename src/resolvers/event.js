import lzstring from 'lz-string';

import { useModels } from '../providers';

const resolvers = {
  Query: {
    async event(query, { eventId }) {
      const { Area, Event } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
        include: [{ model: Area, as: 'area' }],
      });

      return event;
    },
  },

  Event: {
    description(event) {
      return lzstring.decompressFromBase64(event.description.toString());
    },

    location(event) {
      return event.location.coordinates;
    },

    duration(event) {
      if (event.endsAt && event.startsAt) {
        return event.endsAt.getTime() - event.startsAt.getTime();
      }
    },
  },
};

export default resolvers;
