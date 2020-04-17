import asyncHandler from 'express-async-handler';

import myContract from './myContract';

const me = () => asyncHandler(async (req, res, next) => {
  if (!req.myContract) return next();

  const me = await req.myContract.getUser();

  if (!me) return next();

  req.me = me;

  next();
});

export default (...args) => [
  myContract(...args),
  me(...args),
];
