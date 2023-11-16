"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("staff_infor", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            staffId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            provinceId: {
                type: Sequelize.STRING,
            },
            paymentId: {
                type: Sequelize.STRING,
            },
            addressClinic: {
                type: Sequelize.STRING,
            },
            nameClinic: {
                type: Sequelize.STRING,
            },
            note: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.STRING,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("staff_infor");
    },
};
