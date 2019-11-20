import { parse as parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';

import models from '../models';

const getMe = () => async (req, res, next = Function) => {
  if (!req) {
    next();

    return;
  };

  const cookie = req.headers.cookie;

  if (!cookie) {
    next();

    return;
  };

  const { authToken } = parseCookie(cookie);

  const userId = await new Promise((resolve, reject) => {
    jwt.verify(authToken, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, id) => {
      if (err) {
        res.clearCookie('authToken');
        resolve();
      } else {
        resolve(id);
      }
    });
  });

  if (!userId) {
    next();

    return;
  }

  req.me = await models.User.findOne({
    where: {
      id: userId,
    }
  });

  next();
};

export default getMe;
