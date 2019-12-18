import { parse as parseCookie } from 'cookie';

import { provideMe, useServices } from '../providers';

export const defineMe = () => async (req, res, next) => {
  const { auth } = useServices();
  const cookie = req.headers.cookie;

  if (!cookie) {
    next();

    return;
  }

  const { authToken } = parseCookie(cookie);

  const me = await auth.defineMe(authToken);

  if (!me) {
    res.clearCookie('authToken');
  }

  provideMe(req);

  next();
};
