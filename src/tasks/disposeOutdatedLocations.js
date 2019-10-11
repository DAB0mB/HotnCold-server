const INTERVAL = 5 * 60 * 1000

const disposeOutdatedLocations = ({ models }) => {
  return models.User.disposeOutdatedLocations();
};

export default (context) => {
  setInterval(() => {
    disposeOutdatedLocations(context).catch(e => console.error(e));
  }, INTERVAL);
};
