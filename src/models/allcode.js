"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //63
    static associate(models) {
      //quan hệ 1 nhiều
      AllCode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
      AllCode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      //76
      AllCode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })
      //80 1 Allcode có nhiều Staff_infor, trường priceId sẽ match vs cái table Allcode của we
      AllCode.hasMany(models.Staff_infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      AllCode.hasMany(models.Staff_infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })

    }
  }
  AllCode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEN: DataTypes.STRING,
      valueVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
    }
  );
  return AllCode;
};
