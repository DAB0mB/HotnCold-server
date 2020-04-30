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
            userId: { $ne: me.id },
            createdAt: { $lt: anchorCreatedAt },
          },
        },
        limit,
        attributes: [
          'id',
          'name',
          'avatar',
          'pictures',
          'bio',
        ],
        order: [[Sequelize.literal('"events_attendees"."createdAt"'), 'DESC']],
      });

      // Put me first. Always
      if (!anchor && await new Event({ id: eventId }).hasAttendee(me)) {
        attendees.unshift(me);
        attendees.splice(limit);
      }

      // TODO: Use a single query
      const checkIns = await EventAttendee.findAll({
        where: { userId: attendees.map(a => a.id) },
        attributes: ['userId', 'createdAt'],
      });

      checkIns.forEach((checkIn) => {
        const attendee = attendees.find(a => a.id === checkIn.userId);

        attendee.checkedInAt = checkIn.createdAt;
      });

      return attendees;
    },

    async veryFirstAttendee(query, { eventId }) {
      const { Event, EventAttendee } = useModels();

      const [attendee] = await new Event({ id: eventId }).getAttendees({
        limit: 1,
        attributes: [
          'id',
          'name',
          'avatar',
          'pictures',
          'bio',
        ],
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'DESC']],
      });

      if (!attendee) return null;

      const [checkIn] = await EventAttendee.findAll({
        where: { userId: attendee.id },
        attributes: ['userId', 'createdAt'],
      });

      attendee.checkedInAt = checkIn.createdAt;

      return attendee;
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

  Attendee: {
    avatar(attendee) {
      return attendee.ensureAvatar();
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
      return event.sourceAttendanceCount + (await event.countAttendees());
    },
  },
};

export default resolvers;
