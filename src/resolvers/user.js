export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
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
