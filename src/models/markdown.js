"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //68 1 Markdown  chỉ có 1 user
            //tại sao ko dùng hasOn mà dùng belongsTo vì Key nó là 'User'
            //vì ko thể dùng 2 thằng mà có hasOne được các quan hệ khác cx v
            Markdown.belongsTo(models.User, { foreignKey: 'staffId' })
        }
    }
    Markdown.init(
        {
            contentHTML: DataTypes.TEXT('long'),
            contentMarkdown: DataTypes.TEXT('long'),
            description: DataTypes.TEXT('long'),
            staffId: DataTypes.INTEGER,
            specialtyId: DataTypes.INTEGER,
            serviceId: DataTypes.INTEGER,
            clinicId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Markdown",
        }
    );
    return Markdown;
};
