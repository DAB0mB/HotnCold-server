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
          [Sequelize.literal('"events_attendees"."createdAt"'), 'checkedInAt'],
        ],
        order: [[Sequelize.literal('"events_attendees"."createdAt"'), 'DESC']],
      });

      const [meAttendee] = await new Event({ id: eventId }).getAttendees({
        limit: 1,
        through: {
          where: {
            userId: me.id,
          },
        },
        attributes: [
          'id',
          'name',
          'avatar',
          'pictures',
          'bio',
          [Sequelize.literal('"events_attendees"."createdAt"'), 'checkedInAt'],
        ],
      });

      // Put me first. Always
      if (!anchor && meAttendee) {
        attendees.unshift(meAttendee);
        attendees.splice(limit);
      }

      return attendees;
    },

    async veryFirstAttendee(query, { eventId }) {
      const { Event } = useModels();

      const [attendee] = await new Event({ id: eventId }).getAttendees({
        limit: 1,
        attributes: [
          'id',
          'name',
          'avatar',
          'pictures',
          'bio',
          [Sequelize.literal('"events_attendees"."createdAt"'), 'checkedInAt'],
        ],
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'DESC']],
      });

      if (!attendee) return null;

      return attendee;
    },

    async scheduledEvents(query, { limit, anchor }, { me }) {
      const { EventAttendee } = useModels();

      const myArea = await me.getArea();

      if (!myArea) return [];

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
            createdAt: {
              $lt: anchorCreatedAt,
            },
          },
        },
        where: {
          endsAt: { $gt: new Date() },
          areaId: myArea.id,
        },
        attributes: {
          include: [[Sequelize.literal('"events_attendees"."createdAt"'), 'checkedInAt']],
        },
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'ASC']],
        limit,
      });

      scheduledEvents.forEach((event) => {
        event.area = myArea;
        event.checkedInAt = event.dataValues.checkedInAt;
      });

      return scheduledEvents;
    },

    async veryFirstScheduledEvent(query, args, { me }) {
      const myArea = await me.getArea();

      if (!myArea) return null;

      const [event] = await me.getScheduledEvents({
        attributes: {
          include: [[Sequelize.literal('"events_attendees"."createdAt"'), 'checkedInAt']],
        },
        where: {
          areaId: myArea.id,
          endsAt: { $gt: new Date() },
        },
        order: [[Sequelize.literal('"events_attendees.createdAt"'), 'DESC']],
        limit: 1,
      });

      if (!event) return null;

      event.area = myArea;
      event.checkedInAt = event.dataValues.checkedInAt;

      return event;
    },
  },

  Mutation: {
    async toggleCheckIn(mutation, { eventId, checkedIn }, { me }) {
      const { Area, Event } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
        include: [{ model: Area }],
      });

      if (!event) {
        throw Error(`Event with ID ${eventId} not found`);
      }

      if (await event.hasAttendee(me) && (typeof checkedIn != 'boolean' || checkedIn === false)) {
        await event.removeAttendee(me);

        return event;
      }
      else if (typeof checkedIn != 'boolean' || checkedIn === true) {
        await event.addAttendee(me);

        return event;
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
