export default {
  Query: {
    me: (parent, args, { me }) => {
      return me
    },
  },
};
