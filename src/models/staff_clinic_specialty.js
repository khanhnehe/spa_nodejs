"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff_Clinic_Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Staff_Clinic_Specialty.init(
    {
      staffId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: "Staff_Clinic_Specialty",
    }
  );
  return Staff_Clinic_Specialty;
};
