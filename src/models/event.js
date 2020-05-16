import lzstring from 'lz-string';
import moment from 'moment';
import uuid from 'uuid';

import { useMeetup, useModels } from '../providers';
import { bulkUpsert, kilometersToMiles } from '../utils';
import { Location } from './mixins';

export const Source = {
  meetup: 'meetup',
};

export const Category = {
  OutdoorsAdventure: 'outdoors-adventure',
  Tech: 'tech',
  ParentsFamily: 'parents-family',
  HealthWellness: 'health-wellness',
  SportsFitness: 'sports-fitness',
  Education: 'education',
  Photography: 'photography',
  Food: 'food',
  Writing: 'writing',
  Language: 'language',
  Music: 'music',
  Movements: 'movements',
  Lgbtq: 'lgbtq',
  Film: 'film',
  GamesSciFi: 'games-sci-fi',
  Beliefs: 'beliefs',
  ArtsCulture: 'arts-culture',
  BookClubs: 'book-clubs',
  Dancing: 'dancing',
  Pets: 'pets',
  HobbiesCrafts: 'hobbies-crafts',
  FashionBeauty: 'fashion-beauty',
  Social: 'social',
  CareerBusiness: 'career-business',
};

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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM(Object.values(Source)),
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

  Event.Source = Source;
  Event.Category = Category;

  Event.associate = (models) => {
    Event.hasMany(models.Comment);
    Event.belongsTo(models.Area);
    Event.belongsToMany(models.User, { as: 'attendees', through: models.EventAttendee });
  };

  Event.syncMeetupEvents = async () => {
    const { Area } = useModels();
    const meetup = useMeetup();

    const areas = await Area.findAll({
      attributes: ['id', 'center', 'timezone'],
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
          start_date_range: moment().tz(area.timezone).add(i, 'days').format('YYYY-MM-DDTHH:mm'),
          end_date_range: moment().tz(area.timezone).add(i + step, 'days').format('YYYY-MM-DDTHH:mm'),
          fields: 'featured_photo,group_category',
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
            'events.group',
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
            startsAt: new Date(event.time),
            endsAt: event.duration && new Date(event.time + event.duration),
            sourceAttendanceCount: event.yes_rsvp_count,
            maxPeople: event.rsvp_limit,
            sourceLink: event.link,
            venueName: event.venue.name,
            address: event.venue.address_1,
            featuredPhoto: event.featured_photo?.photo_link,
            location: `POINT(${event.venue.lon} ${event.venue.lat})`,
            category: event.group.category.name,
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
