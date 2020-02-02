const chatUser = (sequelize, DataTypes) => {
  const ChatUser = sequelize.define('chats_users', {
    unreadMessagesIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
  });

  return ChatUser;
};

export default chatUser;
