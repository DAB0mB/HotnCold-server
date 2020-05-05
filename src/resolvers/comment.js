import { withFilter } from 'apollo-server';

import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    async comments(query, { eventId, limit, anchor }) {
      const { Event, Comment } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return [];
      }

      let anchorCreatedAt = new Date();
      if (anchor) {
        const comment = await Comment.findOne({
          where: { id: anchor },
          attributes: ['createdAt'],
        });

        if (comment) {
          anchorCreatedAt = comment.createdAt;
        }
      }

      const comments = await event.getComments({
        where: {
          createdAt: { $lt: anchorCreatedAt },
        },
        order: [['createdAt', 'ASC']],
        limit,
      });

      return comments;
    },

    async veryFirstComment(query, { eventId }) {
      const { Event } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return null;
      }

      const comments = await event.getComments({
        order: [['createdAt', 'DESC']],
        limit: 1,
      });

      return comments[0];
    },

    async commentsCount(query, { eventId }) {
      const { Event } = useModels();

      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return null;
      }

      return event.countComments();
    },
  },

  Mutation: {
    async createComment(mutation, { eventId, text }, { me }) {
      const { Comment } = useModels();
      const pubsub = usePubsub();

      const comment = await Comment.create({
        text,
        eventId,
        userId: me.id,
      });

      pubsub.publish('commentCreated', {
        comment,
      });

      return comment;
    },

    async deleteComment(mutation, { commentId }, { me }) {
      const { Comment } = useModels();
      const pubsub = usePubsub();

      const comment = await Comment.findOne({
        where: {
          id: commentId,
          userId: me.id,
        },
      });

      if (!comment) return false;

      await comment.destroy();

      pubsub.publish('commentDeleted', {
        comment,
      });

      return true;
    },
  },

  Subscription: {
    commentCreated: {
      resolve({ comment }) {
        const { Comment } = useModels();

        return new Comment(comment);
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('commentCreated'),
        async ({ comment }, { eventId }, { me }) => {
          return (
            me &&
            comment &&
            comment.eventId === eventId
          );
        },
      ),
    },

    commentDeleted: {
      resolve({ comment }) {
        return comment.id;
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('commentDeleted'),
        async ({ comment }, { eventId }, { me }) => {
          return (
            me &&
            comment &&
            comment.eventId === eventId
          );
        },
      ),
    },
  },

  Comment: {
    user(comment) {
      return comment.getUser();
    },
  },
};

export default resolvers;
