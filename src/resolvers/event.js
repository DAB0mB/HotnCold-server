import lzstring from 'lz-string';
import Sequelize from 'sequelize';

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

    async attendees(query, { eventId, limit, anchor }, { me }) {
      const { Event, EventAttendee } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return [];
      }

      let anchorCreatedAt = new Date();
      if (anchor) {
        const attendee = await EventAttendee.findOne({
          where: { eventId, userId: anchor },
          attributes: ['createdAt'],
        });

        if (attendee) {
          anchorCreatedAt = attendee.createdAt;
        }
      }

      const attendees = await event.getAttendees({
        through: {
          where: {
            $or: [
              // Put me first
              !anchor && {
                userId: me.id
              },
              {
                userId: { $ne: me.id },
                createdAt: { $lt: anchorCreatedAt },
              },
            ].filter(Boolean),
          },
        },
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'DESC']],
        limit,
      });

      return attendees;
    },

    async veryFirstAttendee(query, { eventId }) {
      const { Event } = useModels();

      const attendees = await new Event({ id: eventId }).getAttendees({
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'DESC']],
        limit: 1,
      });

      return attendees[0];
    },

    async scheduledEvents(query, { limit, anchor }, { me }) {
      const { EventAttendee } = useModels();

      let anchorCreatedAt = new Date();
      if (anchor) {
        const eventAttendee = await EventAttendee.findOne({
          where: { userId: me.id, eventId: anchor },
          attributes: ['createdAt'],
        });

        if (eventAttendee) {
          anchorCreatedAt = eventAttendee.createdAt;
        }
      }

      const scheduledEvents = await me.getScheduledEvents({
        through: {
          where: {
            createdAt: { $lt: anchorCreatedAt },
          },
        },
        order: [['scheduledEvents', 'createdAt', 'DESC']],
        limit,
      });

      return scheduledEvents;
    },

    async veryFirstScheduledEvent(query, args, { me }) {
      const events = await me.getScheduledEvents({
        order: [['scheduledEvents', 'createdAt', 'DESC']],
        limit: 1,
      });

      return events[0];
    },
  },

  Mutation: {
    async toggleCheckIn(mutation, { eventId }, { me }) {
      const { Event } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return false;
      }

      if (await event.hasAttendee(me)) {
        await event.removeAttendee(me);

        return false;
      }
      else {
        await event.addAttendee(me);

        return true;
      }
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

    checkedIn(event, args, { me }) {
      return event.hasAttendee(me);
    },

    async attendanceCount(event) {
      return event.attendanceCount + (await event.countAttendees());
    },
  },
};

export default resolvers;
