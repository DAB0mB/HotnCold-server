import { gql } from 'apollo-server-express';

export default gql`
  enum EventSource {
    meetup
  }

  extend type Query {
    event(eventId: ID!): Event! @auth
    attendees(eventId: ID!, limit: Int!, anchor: ID): [User]! @auth
    veryFirstAttendee(eventId: ID!): User @auth
    scheduledEvents(limit: Int!, anchor: ID): [Event]! @auth
    veryFirstScheduledEvent: Event @auth
  }

  extend type Mutation {
    toggleCheckIn(eventId: ID!): Boolean! @auth
  }

  type Event {
    id: ID!
    source: EventSource!
    name: String!
    localDate: String!
    localTime: String!
    startsAt: DateTime!
    endsAt: DateTime!
    description: String!
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
  }
`;
