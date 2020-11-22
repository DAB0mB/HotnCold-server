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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceComment: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    signed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
