import { provideCloudinary } from '../providers';

const bootstrapCloudinary = () => {
  const cloudinary = require('cloudinary');
  const match = process.env.CLOUDINARY_URL.match(/^cloudinary\:\/\/(\d+)\:(\w+)@(.+)$/);

  if (!match) return;

  const [api_key, api_secret, cloud_name] = match.slice(1);
  cloudinary.config({ api_key, api_secret, cloud_name });

  provideCloudinary(cloudinary);
};

export default bootstrapCloudinary;
