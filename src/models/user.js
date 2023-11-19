"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //63
    static associate(models) {
      //1 user sẽ belongto tức thuộc về nhiều cái model allcode
      User.belongsTo(models.AllCode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.AllCode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })

      //1 User chỉ có 1 markdown mà markdown cx chỉ có 1 user
      User.hasOne(models.Markdown, { foreignKey: 'staffId' })
      //80table  User sẽ tự động match vs trường  staffId trên cái table Staff_infor
      User.hasOne(models.Staff_infor, { foreignKey: 'staffId' })

    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phonemumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
