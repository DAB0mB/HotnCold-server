import Sequelize, { Op } from 'sequelize';

import { useModels } from '../providers';

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
  },

  Area: {
    center(area) {
      return area.center.coordinates;
    },
  },
};

export default resolvers;
