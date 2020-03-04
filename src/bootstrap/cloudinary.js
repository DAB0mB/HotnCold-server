import { provideCloudinary } from '../providers';

const bootstrapCloudinary = () => {
  const cloudinaryClient = require('cloudinary').v2;
  const Cloudinary = require('../services/cloudinary').default;

  const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/(\d+):(\w+)@(.+)$/);

  if (!match) return;

  const [api_key, api_secret, cloud_name] = match.slice(1);

  cloudinaryClient.config({ api_key, api_secret, cloud_name });

  const cloudinary = new Cloudinary(cloudinaryClient);

  provideCloudinary(cloudinary);
};

export default bootstrapCloudinary;
