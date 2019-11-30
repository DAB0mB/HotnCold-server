import { provideServices } from '../providers';
import * as services from '../services';

const bootstrapServices = () => {
  provideServices(services);
};

export default bootstrapServices;
