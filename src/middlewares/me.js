import asyncHandler from 'express-async-handler';

import { useModels } from '../providers';
import myContract from './myContract';

const me = () => asyncHandler(async (req, res, next) => {
  const { Status } = useModels();

  if (!req.myContract) return next();

  const me = await req.myContract.getUser({
    include: [{ model: Status, as: 'status' }],
  });

  if (!me) return next();

  req.me = me;

  next();
});

export default (...args) => [
  myContract(...args),
  me(...args),
];
