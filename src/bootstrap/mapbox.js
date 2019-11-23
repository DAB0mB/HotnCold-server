import { provideMapbox } from '../providers';

const bootstrapMapbox = () => {
  const Mapbox = require('mapbox');
  const MapboxDatasets = require('@mapbox/mapbox-sdk/services/datasets');
  const MapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
  const mapbox = Mapbox({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

  provideMapbox({
    datasets: MapboxDatasets(mapbox),
    geocoding: MapboxGeocoding(mapbox),
  });
};

export default bootstrapMapbox;
