import { gql } from 'apollo-server-express';

export default gql`
  enum EventSource {
    meetup
  }

  extend type Query {
    event(eventId: ID!): Event! @auth
    attendees(eventId: ID!, limit: Int!, anchor: ID): [Attendee]! @auth
    veryFirstAttendee(eventId: ID!): Attendee @auth
    scheduledEvents(limit: Int!, anchor: ID): [Event]! @auth
    veryFirstScheduledEvent: Event @auth
  }

  extend type Mutation {
    toggleCheckIn(eventId: ID!, checkedIn: Boolean): Event! @auth
  }

  extend type Subscription {
    checkInToggled: Event @auth
  }

  type Attendee {
    id: ID!
    name: String!
    checkedInAt: DateTime
    bio: String
    avatar: String
  }

  type Event {
    id: ID!
    source: EventSource!
    name: String!
    category: String!
    localDate: String!
    localTime: String!
    startsAt: DateTime!
    endsAt: DateTime!
    description: String!
    sourceAttendanceCount: Int!
    attendanceCount: Int!
    location: Vector2D!
    venueName: String!
    area: Area!
    checkedIn: Boolean!
    duration: Int
    maxPeople: Int
    address: String
    featuredPhoto: String
    sourceLink: String
    checkedInAt: DateTime
  }
`;
