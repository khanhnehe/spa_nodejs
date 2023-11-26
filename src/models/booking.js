"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 bệnh nhân có thể có nhiều lịch hẹn
      // nhiều lịch khám có thể thuộc 1 bệnh nhân => quan hện 1 nhiều
      Booking.belongsTo(models.User,
        { foreignKey: 'patientID', targetKey: 'id', as: 'patientData' })
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      staffId: DataTypes.INTEGER, // staffId là INTEGER vì là  staffId: DataTypes.INTEGER staffId là INTEGER vì là chính là cái id của bảng Users
      patientID: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      token: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
