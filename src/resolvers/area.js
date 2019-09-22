import * as mapbox from '../mapbox';
import models from '../models';

const { Area } = models;

export default {
  Area: {
    bbox: (area) => {
      const feature = await mapbox.geocoding.forwardGeocode({
        query: area.name,
        types: ['region', 'district', 'locality', 'place'],
      }).send().then(({ body }) => body.features.find(f => f.place_name === area.name));

      return feature && feature.bbox;
    },
  },
};
