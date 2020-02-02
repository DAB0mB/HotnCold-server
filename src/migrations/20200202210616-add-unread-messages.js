'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('chats_users', 'unreadMessagesIds', {
      type: Sequelize.ARRAY(Sequelize.UUID),
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('chats_users', 'unreadMessagesIds');
  },
};
