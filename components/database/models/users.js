'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Username already exists.'
      },
      allowNull: {
        args: false,
        msg: 'Username should not be null.'
      }

    },
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING(120),
      unique: {
        args: true,
        msg: 'Email address already exists.',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address.',
        },
      },
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: {
        args: false,
        msg: 'Please set a date on when the Employee was hired.'
      }
    },
    realm: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'tbl_user',
    timestamp: false,
    createdAt: false,
    updatedAt: false
  });
  return Users;
};