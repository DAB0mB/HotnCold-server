import jwt from 'jsonwebtoken';
import uuid from 'uuid';

const contract = (sequelize, DataTypes) => {
  const Contract = sequelize.define('contract', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: 4,
      },
    },
    signed: {
      type: DataTypes.BOOLEAN,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
    },
  });

  Contract.associate = (models) => {
    Contract.belongsTo(models.User);
  };

  Contract.findByToken = async (authToken) => {
    if (typeof authToken != 'string') return null;

    const contractId = await new Promise((resolve) => {
      jwt.verify(authToken, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, id) => {
        if (err) {
          resolve();
        }
        else {
          resolve(id);
        }
      });
    });

    if (!contractId) {
      return null;
    }

    return Contract.findOne({
      where: {
        id: contractId,
      },
    });
  };

  return Contract;
};

export default contract;
