import uuid from 'uuid';

import { useCloudinary, useModels } from '../providers';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationsToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
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

  User.associate = (models) => {
    User.hasOne(models.Contract);
    User.hasMany(models.Message);
    User.hasMany(models.ChatSubscription, { as: 'subscriptions' });
    User.belongsToMany(models.Status, { through: models.StatusUser, as: 'statuses' });
    User.belongsToMany(models.Chat, { through: models.ChatUser, as: 'chats' });
  };

  User.prototype.ensureAvatar = async function ensureAvatar() {
    const cloudinary = useCloudinary();

    let avatar = this.avatar;

    // Not likely to happen, useful for migration purposes
    if (avatar) return avatar;
    if (!this.pictures[0]) return null;

    avatar = await cloudinary.uploadFromUrl(this.pictures[0], { upload_preset: 'avatar-pic' });
    // This is an atomic operation, so it's relatively safe
    await this.update({ avatar });

    return avatar;
  };

  User.prototype.getContract = function getContract(options = {}) {
    const { Contract } = useModels();

    return Contract.find({
      ...options,
      where: { userId: this.id },
    });
  };

  return User;
};

export default user;
