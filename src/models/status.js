import uuid from 'uuid';

import { useCloudinary } from '../providers';

const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isMeetup: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  Status.prototype.ensureThumb = async function ensureThumb() {
    const cloudinary = useCloudinary();

    let thumb = this.thumb;

    // Not likely to happen, useful for migration purposes
    if (thumb) return thumb;
    if (!this.images?.[0]) return null;

    thumb = await cloudinary.uploadFromUrl(this.images[0], { upload_preset: 'thumb' });
    // This is an atomic operation, so it's relatively safe
    await this.update({ thumb });

    return thumb;
  };

  Status.prototype.ensureAvatar = async function ensureAvatar() {
    const cloudinary = useCloudinary();

    let avatar = this.avatar;

    // Not likely to happen, useful for migration purposes
    if (avatar) return avatar;
    if (!this.images?.[0]) return null;

    avatar = await cloudinary.uploadFromUrl(this.images[0], { upload_preset: 'avatar-pic' });
    // This is an atomic operation, so it's relatively safe
    await this.update({ avatar });

    return avatar;
  };

  Status.associate = (models) => {
    Status.belongsTo(models.Area);
    Status.belongsTo(models.Chat);
    Status.belongsToMany(models.User, { through: models.StatusUser, as: 'users' });
  };

  return Status;
};

export default status;