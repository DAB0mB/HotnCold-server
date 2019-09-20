import * as mapbox from '../mapbox';

export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
    },

    usersLocationsInArea: (query, { center, bounds }) => {
      return mapbox.geocoding.reverseGeocode({
        query: center,
        bbox: [...bounds[0], ...bounds[1]],
        limit: 200,
      }).send().then(({ body }) => body);
    },
  },

  User: {
    age: (user, args) => {
      const birthYear = Number(user.birthDate.split('/').pop());
      const currentYear = new Date().getYear() + 1900;

      return currentYear - birthYear;
    },

    location: (user, args) => {
      return mapbox.datasets.getFeature({
        datasetId: process.env.ACTIVE_USERS_DATASET_ID,
        featureId: `user_${user.id}`,
      }).send().then(({ body }) => body && body.geometry.coordinates);
    },
  },
};
