const MILES_TO_KILOMETERS = 1.60934;

export const milesToKilometers = (miles) => {
  return miles * MILES_TO_KILOMETERS;
};

export const kilometersToMiles = (kms) => {
  return kms / MILES_TO_KILOMETERS;
};
