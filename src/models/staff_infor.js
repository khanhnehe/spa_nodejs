"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Staff_infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //80 Staff_infor quan hệ vs table Allcode

            Staff_infor.belongsTo(models.User, { foreignKey: 'staffId' })
            Staff_infor.belongsTo(models.AllCode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            Staff_infor.belongsTo(models.AllCode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })

        }
    }
    Staff_infor.init(
        {
            staffId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Staff_infor",
            freezeTableName: true

        }
    );
    return Staff_infor;
};
