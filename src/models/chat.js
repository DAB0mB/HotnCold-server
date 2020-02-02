import uuid from 'uuid';

import { useModels } from '../providers';

const chat = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
  });

  Chat.findForUsers = async (users, options = {}) => {
    const { User } = useModels();

    users = await Promise.all(users.map((u) => {
      if (u instanceof User) {
        return u;
      }

      return User.findOne({
        where: { id: u },
        attributes: ['id'],
      });
    }));

    let chats = await users[0].getChats({
      attributes: ['id']
    });

    if (!chats) {
      return [];
    }

    for (let user of users.slice(1)) {
      chats = await user.getChats({
        where: {
          id: { $in: chats.map(c => c.id) },
        },
        attributes: ['id']
      });

      if (!chats.length) {
        return [];
      }
    }

    return Chat.findAll({
      ...options,
      where: {
        id: { $in: chats.map(c => c.id) },
      },
    });
  };

  Chat.associate = (models) => {
    Chat.hasMany(models.Message);
    Chat.belongsToMany(models.User, { through: models.ChatUser });
  };

  return Chat;
};

export default chat;
