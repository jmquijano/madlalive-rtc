'use strict';
const { Model, Deferrable } = require('sequelize');
const { Meeting, Users } = require('./meeting');

module.exports = (sequelize, DataTypes) => {
    class MeetingPeer extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Meeting, {
                foreignKey: 'meeting'
            });

            this.belongsTo(models.Users, {
                foreignKey: 'user'
            });
        }
    }

    MeetingPeer.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        meeting: {
            type: DataTypes.INTEGER,
            references: {
                model: Meeting,
                key: 'id',
                deferrable: Deferrable.NOT
            }
        },
        user: {
            type: DataTypes.INTEGER,
            references: {
                model: Users,
                key: 'id',
                deferrable: Deferrable.NOT
            }
        },
        connectionString: {
            type: DataTypes.STRING
        },
        connectionHMAC: {
            type: DataTypes.STRING
        },
        connectionDeviceDetails: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
        modelName: 'MeetingPeer',
        tableName: 'tbl_meeting_peer',
        timestamp: false,
        createdAt: false,
        updatedAt: false
    });

    return MeetingPeer;
}