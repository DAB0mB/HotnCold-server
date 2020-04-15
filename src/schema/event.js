import { gql } from 'apollo-server-express';

export default gql`
  enum EventSource {
    meetup
  }

  extend type Query {
    event(eventId: ID!): Event! @auth
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
    duration: Int
    maxPeople: Int
    address: String
    featuredPhoto: String
    link: String
  }
`;
