'use strict';
const { Model, Deferrable } = require('sequelize');
const { MeetingPeer, Meeting } = require('./meeting');

module.exports = (sequelize, DataTypes) => {
    class Chat extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.MeetingPeer, {
                foreignKey: 'peer'
            });

            this.belongsTo(models.Meeting, {
                foreignKey: 'meeting'
            });
        }
    }

    Chat.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        peer: {
            type: DataTypes.INTEGER,
            references: {
                model: MeetingPeer,
                key: 'id',
                deferrable: Deferrable.NOT
            }
        },
        meeting: {
            type: DataTypes.INTEGER,
            references: {
                model: Meeting,
                key: 'id',
                deferrable: Deferrable.NOT
            }
        },
        message: {
            type: DataTypes.JSON
        },
        createdAt: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
        modelName: 'Chat',
        tableName: 'tbl_meeting_chat',
        timestamp: false,
        createdAt: false,
        updatedAt: false
    })

    return Chat;
};