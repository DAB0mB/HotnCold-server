import bodyParser from 'body-parser';
import express from 'express';
import asyncHandler from 'express-async-handler';

const rest = express.Router();
rest.use(bodyParser.json());

// Locations are sent in background automatically via REST
rest.post('/location', asyncHandler(async (req, res) => {
  const { me } = req;

  if (!me) {
    res.status(401).send('Unauthorized');

    return;
  }

  await me.setLocation([req.body[0].longitude, req.body[0].latitude]);

  res.json(me.location);
}));

export default rest;
