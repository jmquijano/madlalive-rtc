const { gql } = require('apollo-server-express');

module.exports = gql`
    type Host {
        id: Int!
        username: String!
        firstName: String!
        middleName: String!
        displayName: String!
        profileUrl: String!,
        me: Boolean!
    }

    type CreateMeeting {
        agoraHostMeetingId: String!
        agoraParticipantMeetingId: String!
        meetingName: String!
        meetingDesc: String!
        meetingPasscode: String!
        enableWaitingRoom: Boolean!
        meetingLink: String!
        meetingLinkWithPasscode: String!
    }

    type HostedMeeting {
        meetingSharedIdentifier: String!
        agoraHostMeetingId: String!
        agoraParticipantMeetingId: String!
        meetingName: String!
        meetingDesc: String!
        meetingPasscode: String!
        enableWaitingRoom: Boolean!
        meetingLink: String!
        meetingLinkWithPasscode: String!
        createdAt: String!
    }

    type JoinedMeeting {
        meetingSharedIdentifier: String!
        meetingName: String!
        meetingDesc: String!
        enableWaitingRoom: Boolean!
        meetingLink: String!
        meetingLinkWithPasscode: String!
        host: Host!
        createdAt: String!
    }

    

    extend type Query {
        GetAllHostedMeeting: [HostedMeeting]
        GetAllJoinedMeeting: [JoinedMeeting]
        GetSpecificHostedMeeting (meetingSharedIdentifier: String!): HostedMeeting
    }

    extend type Mutation {
        CreateMeeting(meetingName: String!, meetingDesc: String!, enableWaitingRoom: Boolean!) : CreateMeeting
    }
    
`;