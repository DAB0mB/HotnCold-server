import bootstrapCloudinary from './cloudinary';
import bootstrapMapbox from './mapbox';
import bootstrapModels from './models';
import bootstrapPubsub from './pubsub';
import bootstrapServices from './services';

const bootstrap = () => {
  return Promise.all([
    bootstrapCloudinary(),
    bootstrapMapbox(),
    bootstrapModels(),
    bootstrapPubsub(),
    bootstrapServices(),
  ]);
};

export default bootstrap;
