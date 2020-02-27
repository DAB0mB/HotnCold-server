import { useModels, useMapbox } from '../../providers';

export const extend = (Model, { locationTimeout }) => {
  Model.prototype.setLocation = async function setLocation(coordinates, useStage) {
    const mapbox = useMapbox();
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

      const geoFeaturesIds = await mapbox.geocoding.reverseGeocode({
        query: coordinates,
        types: ['region', 'district', 'locality', 'place'],
      }).send().then(({ body }) => body.features.map(f => f.id));

      // Area might be available from join op
      const area = await Area.findOne({
        where: {
          geoFeaturesIds: {
            $overlap: geoFeaturesIds,
          },
        },
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
