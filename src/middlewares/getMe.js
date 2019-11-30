import { parse as parseCookie } from 'cookie';

import { useServices } from '../providers';

const getMe = () => async (req, res, next) => {
  const { auth } = useServices();
  const cookie = req.headers.cookie;

  if (!cookie) {
    next();

    return;
  };

  const { authToken } = parseCookie(cookie);

  req.me = await auth.getMe(authToken);

  if (!req.me) {
    res.clearCookie('authToken');
  }

  next();
};

export default getMe;
