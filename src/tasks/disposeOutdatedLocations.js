const INTERVAL = 5 * 60 * 1000

const disposeOutdatedLocations = ({ models }) => {
  return models.User.disposeOutdatedLocations().catch(e => console.error(e));
};

export default (context) => {
  setInterval(() => {
    disposeOutdatedLocations(context);
  }, INTERVAL);

  disposeOutdatedLocations(context);
};
