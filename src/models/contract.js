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
    passcodeExpiresAt: {
      type: DataTypes.DATE,
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
      jwt.verify(authToken, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, { contractId, expires } = {}) => {
        if (err) {
          return resolve();
        }

        if (new Date(expires) < new Date()) {
          return resolve();
        }

        resolve(contractId);
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
