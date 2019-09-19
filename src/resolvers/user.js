export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
    },

    usersLocationsInArea: (query, { bounds }) => {
      return mapbox.geocoding.reverseGeocode({
        bbox: bounds
      });
    },
  },

  User: {
    age: (user, args) => {
      const birthYear = Number(user.birthDate.split('/').pop());
      const currentYear = new Date().getYear() + 1900;

      return currentYear - birthYear;
    },
  },
};
