import lzstring from 'lz-string';
import moment from 'moment';
import uuid from 'uuid';

import { useMeetup, useModels } from '../providers';
import { bulkUpsert, kilometersToMiles } from '../utils';
import { Location } from './mixins';

const event = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false,
    },
    localDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    localTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endsAt: {
      type: DataTypes.DATE,
    },
    sourceAttendanceCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    venueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
    },
    sourceLink: {
      type: DataTypes.STRING,
    },
    maxPeople: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    featuredPhoto: {
      type: DataTypes.STRING,
    },
  });

  Event.Source = {
    meetup: 'meetup',
  };

  Event.associate = (models) => {
    Event.belongsTo(models.Area);
    Event.belongsToMany(models.User, { as: 'attendees', through: models.EventAttendee });
  };

  Event.syncMeetupEvents = async () => {
    const { Area } = useModels();
    const meetup = useMeetup();

    const areas = await Area.findAll({
      attributes: ['id', 'center'],
    });

    for (const area of areas) {
      const step = 5;

      // Fetching 100 days ahead, in series to avoid memory throttling
      for (let i = 0; i < 90; i += step) {
        const res = await meetup.getUpcomingEvents({
          lon: area.center.coordinates[0],
          lat: area.center.coordinates[1],
          page: step * 100,
          radius: Math.floor(kilometersToMiles(process.env.MAP_DISCOVERY_DISTANCE / 1000)),
          start_date_range: moment().add(i, 'days').format('YYYY-MM-DDT00:00'),
          end_date_range: moment().add(i + step, 'days').format('YYYY-MM-DDT00:00'),
          fields: 'featured_photo',
          only: [
            'events.id',
            'events.name',
            'events.city',
            'events.local_date',
            'events.local_time',
            'events.time',
            'events.status',
            'events.yes_rsvp_count',
            'events.duration',
            'events.link',
            'events.description',
            'events.rsvp_limit',
            // If we filter venue fields, it's not returned correctly.
            // Probably an issue with Meetup's API
            'events.venue',
            'events.featured_photo',
          ].join(','),
        });

        if (res.errors) {
          for (const error of res.errors) {
            console.error(`[${error.code}] ${error.message}`);
          }

          continue;
        }

        const events = res.events.filter((event) => {
          return event.venue && event.venue.lon && event.venue.lat;
        }).map((event) => {
          return {
            id: `__${Event.Source.meetup}__${event.id}`,
            areaId: area.id,
            source: Event.Source.meetup,
            name: event.name,
            description: lzstring.compressToBase64(event.description),
            localDate: event.local_date,
            localTime: event.local_time,
            startsAt: new Date(event.time),
            endsAt: event.duration && new Date(event.time + event.duration),
            sourceAttendanceCount: event.yes_rsvp_count,
            maxPeople: event.rsvp_limit,
            sourceLink: event.link,
            venueName: event.venue.name,
            address: event.venue.address_1,
            featuredPhoto: event.featured_photo?.photo_link,
            location: `POINT(${event.venue.lon} ${event.venue.lat})`,
          };
        });

        if (events.length) {
          await bulkUpsert(Event, events);
        }
      }
    }

    // According to Meetup's policy, we cannot archive data longer than 30 days
    await Event.destroy({
      where: {
        endsAt: { $lt: new Date() },
      },
    });
  };

  Location.extend(Event, {
    locationTimeout: Number(process.env.USER_LOCATION_TIMEOUT),
  });

  Event.prototype.getDuration = function () {
    const { startsAt, endsAt } = this.dataValues;

    if (startsAt) {
      throw Error('event.startsAt is missing');
    }

    if (endsAt) {
      throw Error('event.endsAt is missing');
    }

    return endsAt.getTime() - startsAt.getTime();
  };

  Event.prototype.getSourceId = function () {
    const { id, source } = this.dataValues;

    return source ? id.split(`__${source}__`).pop() : id;
  };

  return Event;
};

export default event;
