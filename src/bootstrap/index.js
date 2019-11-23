import bootstrapCloudinary from './cloudinary';
import bootstrapMapbox from './mapbox';
import bootstrapModels from './models';

const bootstrap = () => {
  return Promise.all([
    bootstrapCloudinary(),
    bootstrapMapbox(),
    bootstrapModels(),
  ]);
};

export default bootstrap;
