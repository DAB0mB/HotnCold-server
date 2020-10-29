import Sequelize, { Op } from 'sequelize';

import { useMapbox, useModels } from '../providers';

const resolvers = {
  Query: {
    areas(query, { searchText }) {
      const { Area } = useModels();

      return Area.findAll({
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('shortName')), {
            [Op.like]: searchText.toLowerCase() + '%',
          }
        ),
        limit: 10,
      });
    },

    async localAreaPlaces(query, { location, searchText }) {
      const { geocoding } = useMapbox();
      const { Area } = useModels();

      const area = await Area.findOne({
        where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...location)), true),
      });

      const bbox = await area.getBBox();

      if (!bbox) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }

      const featureCollection = await geocoding.forwardGeocode({
        query: searchText,
        types: ['district', 'place', 'locality', 'neighborhood', 'address', 'poi', 'poi.landmark'],
        limit: 15,
        bbox,
      }).send().then(res => res.body);

      return featureCollection;
    },
  },

  Area: {
    center(area) {
      return area.center.coordinates;
    },
  },
};

export default resolvers;
