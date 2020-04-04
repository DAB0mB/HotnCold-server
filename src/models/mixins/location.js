import Sequelize from 'sequelize';

import { useModels } from '../../providers';

export const extend = (Model, { locationTimeout }) => {
  Model.prototype.setLocation = async function setLocation(coordinates, useStage) {
    const { Area } = useModels();
    const { coordinates: selfCoordinates } = this.getDataValue('location') || {};

    updatingCoords:
    if (coordinates) {
      if (
        selfCoordinates &&
        selfCoordinates[0] === coordinates[0] &&
        selfCoordinates[1] === coordinates[1]
      ) {
        break updatingCoords;
      }

      await this.setLocation(null, true);

      const area = await Area.findOne({
        where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...coordinates)), true),
      });

      if (area) {
        await this.setArea(area);
      }
      else {
        await this.setArea(null);
      }

      this.setDataValue('location', {
        type: 'point',
        coordinates,
      });
    }
    else {
      if (!selfCoordinates) {
        break updatingCoords;
      }

      await this.setArea(null);

      this.setDataValue('location', null);
    }

    if (!useStage) {
      this.setDataValue('locationExpiresAt', new Date(Date.now() + locationTimeout));

      await this.save();
    }
  };
};
