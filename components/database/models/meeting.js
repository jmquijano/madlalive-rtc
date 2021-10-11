'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Meeting extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.MeetingPeer, {
                foreignKey: 'meeting',
                as: 'meeting',
                
            });
        }
    }
    
    Meeting.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        agoraHostMeetingId: DataTypes.STRING,
        agoraParticipantMeetingId: DataTypes.STRING,
        meetingName: DataTypes.STRING,
        meetingDesc: DataTypes.STRING,
        meetingPasscode: DataTypes.STRING,
        enableWaitingRoom: DataTypes.BOOLEAN,
        meetingSharedIdentifier: DataTypes.STRING,
        createdBy: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
        modelName: 'Meeting',
        tableName: 'tbl_meeting',
        timestamp: false,
        createdAt: false,
        updatedAt: false
    })

    return Meeting;
}



