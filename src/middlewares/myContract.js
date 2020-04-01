import { parse as parseCookie } from 'cookie';
import asyncHandler from 'express-async-handler';

import { useModels } from '../providers';

const myContract = () => asyncHandler(async (req, res, next) => {
  const { Contract } = useModels();
  const cookie = req.headers.cookie;

  if (!cookie) {
    return next();
  }

  const { authToken } = parseCookie(cookie);
  const myContract = await Contract.findByToken(authToken);

  if (!myContract) {
    return next();
  }

  req.myContract = myContract;

  next();
});

export default myContract;
