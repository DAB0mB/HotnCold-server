const eventAttendee = (sequelize) => {
  const EventAttendee = sequelize.define('events_attendees', {

  });

  return EventAttendee;
};

export default eventAttendee;
