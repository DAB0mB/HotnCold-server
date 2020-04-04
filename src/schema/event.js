import { gql } from 'apollo-server-express';

export default gql`
  enum EventSource {
    meetup
  }

  extend type Query {
    eventDescription(eventSource: EventSource!, eventId: ID!, urlname: String): String! @auth
  }

  type Event {
    id: ID!
    source: EventSource!
    name: String!
    localDate: String!
    localTime: String!
    duration: String!
    description: String!
    attendanceCount: Int!
    location: Vector2D!
    city: String
    maxPeople: Int
    address: String
    venueName: String
    featuredPhoto: String
    link: String
  }
`;
