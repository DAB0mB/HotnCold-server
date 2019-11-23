import { parse as parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';

import { useModels } from '../providers';

const getMe = () => async (req, res, next = Function) => {
  const { User } = useModels();

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

  req.me = await User.findOne({
    where: {
      id: userId,
    }
  });

  next();
};

export default getMe;
