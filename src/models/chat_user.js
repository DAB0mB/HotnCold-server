const chatUser = (sequelize, DataTypes) => {
  const ChatUser = sequelize.define('chats_users', {
    unreadMessagesIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: () => [],
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  return ChatUser;
};

export default chatUser;
