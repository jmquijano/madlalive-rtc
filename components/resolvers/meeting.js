const { AuthenticationError, UserInputError, ValidationError } = require('apollo-server-express');
const { Meeting, MeetingPeer, Users } = require('../database/models');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { ScalarNameResolver } = require('graphql-scalars');
const users = require('../database/models/users');


function sha256(s = '') {
    const hash = crypto.createHash('sha256').update(s).digest('hex');
    return hash;
}

function generatePassword(l = 8, t = 'numeric') {
    var length = l,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";

    if (t === 'numeric') {
        charset = "01234567890";
    }

    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function generateMeetingSharedIdentifier(l = 8, c = "LC", ht = "N") {
    var length = l,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789012345678901234567890123456789012345678901234567890123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    let v = null;

    // Case Type
    if (c === "LC") {
        v = retVal.toLowerCase();
    } else if (c === "UC") {
        v = retVal.toUpperCase();
    } else {
        v = retVal;
    }

    return v;
    
}

module.exports = {
    Query: {
        GetAllHostedMeeting: async (parent, {}, {auth}) => {
            if (!auth?.id) {
                throw new AuthenticationError("You are not logged in.");
            }

            try {
            
                const findHostedMeeting = await Meeting.findAll({
                    where: {
                        createdBy: auth.id
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                });

                let meeting = [];

                findHostedMeeting.map((d, index) => {
                    let o = {
                        meetingSharedIdentifier: d.meetingSharedIdentifier,
                        agoraHostMeetingId: d.agoraHostMeetingId,
                        agoraParticipantMeetingId: d.agoraParticipantMeetingId,
                        meetingName: d.meetingName,
                        meetingDesc: d.meetingDesc,
                        meetingPasscode: d.meetingPasscode,
                        enableWaitingRoom: d.enableWaitingRoom,
                        meetingLink: process.env.SharedMeetingLinkBase + d.meetingSharedIdentifier,
                        meetingLinkWithPasscode: process.env.SharedMeetingLinkBase + d.meetingSharedIdentifier + '?passcode=' + sha256(d.meetingPasscode),
                        createdAt: d.createdAt
                    };
                    
                    meeting.push(o);
                });

                return meeting; 
            } catch (e) {

            }           
        },
        GetAllJoinedMeeting: async (parent, {}, {auth}) => {
            if (!auth.id) {
                throw new AuthenticationError("You are not logged in.");
            }

            try {
                let joinedMeeting = [];

                const findMeetingPeers = await MeetingPeer.findAll({
                    where: {
                        user: auth.id
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: [
                        {
                            model: Meeting,
                            required: true
                        },
                        {
                            model: Users,
                            required: true,
                            attributes: ['id', 'username', 'firstName', 'middleName', 'lastName']
                        }
                    ]
                })

                console.log(JSON.stringify(findMeetingPeers, null, 2));
                findMeetingPeers.map((d, index) => {
                    let o = {
                        meetingSharedIdentifier: d.Meeting.meetingSharedIdentifier,
                        meetingName: d.Meeting.meetingName,
                        meetingDesc: d.Meeting.meetingDesc,
                        enableWaitingRoom: d.Meeting.enableWaitingRoom,
                        meetingLink: process.env.SharedMeetingLinkBase + d.meetingSharedIdentifier,
                        meetingLinkWithPasscode: process.env.SharedMeetingLinkBase + d.Meeting.meetingSharedIdentifier + '?passcode=' + sha256(d.Meeting.meetingPasscode),
                        host: {
                            id: d.User.id,
                            username: d.User.username,
                            firstName: d.User.firstName,
                            middleName: d.User.middleName,
                            displayName: (d.User.id === auth.id ? 'Me' : '@' + d.User.username),
                            profileUrl: (d.User.id === auth.id ? process.env.ProfileLinkBase + '@me' :  process.env.ProfileLinkBase + '@' + d.User.username),
                            me: (d.User.id === auth.id ? true : false)
                        },
                        createdAt: d.createdAt
                    }

                    joinedMeeting.push(o);
                });

                return joinedMeeting;
            } catch(e) {

            }

            
        }
    },
    Mutation: {
        CreateMeeting: async (parent, {meetingName, meetingDesc, enableWaitingRoom}, {auth}) => {
            if (!auth.id) {
                throw new AuthenticationError('You are not logged in.');
            }

            const createMeeting = await Meeting.create({
                agoraHostMeetingId: '{AGORA_HOST_ID}',
                agoraParticipantMeetingId: '{AGORA_PARTICIPANT_ID}',
                meetingName: meetingName,
                meetingDesc: meetingDesc,
                meetingPasscode: generatePassword(12),
                enableWaitingRoom: enableWaitingRoom,
                createdBy: auth.id,
                meetingSharedIdentifier: generateMeetingSharedIdentifier(30)
            });

            return {
                agoraHostMeetingId: createMeeting.agoraHostMeetingId,
                agoraParticipantMeetingId: createMeeting.agoraParticipantMeetingId,
                meetingName: createMeeting.meetingName,
                meetingDesc: createMeeting.meetingDesc,
                meetingPasscode: createMeeting.meetingPasscode,
                enableWaitingRoom: createMeeting.enableWaitingRoom,
                createdBy: createMeeting.createdBy,
                meetingSharedIdentifier: createMeeting.meetingSharedIdentifier,
                meetingLink: process.env.SharedMeetingLinkBase + createMeeting.meetingSharedIdentifier,
                meetingLinkWithPasscode: process.env.SharedMeetingLinkBase + createMeeting.meetingSharedIdentifier + '?passcode=' + sha256(createMeeting.meetingPasscode)
            };
        },
    }
}