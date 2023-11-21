import db from "../models/index";
//73 làm vây để chạy thằng MAX_NUMBER_SCHEDULE=10 bên .env
require('dotenv').config();
import _ from 'lodash'


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

//63
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {

        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.AllCode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                    { model: db.AllCode, as: 'genderData', attributes: ['valueEN', 'valueVI'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {

            reject(e)
        }

    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

const upsertRecord = async (model, condition, data) => {
    try {
        const existingRecord = await model.findOne({ where: condition, raw: true });

        if (!existingRecord) {
            // Create a new record if it doesn't exist
            await model.create(data);
        } else {
            // Update the existing record
            await model.update(data, { where: condition });
        }

        return {
            errCode: 0,
            errMessage: `Save information for ${model.name} succeed!`
        };
    } catch (error) {
        return {
            errCode: 1,
            errMessage: `Error saving information for ${model.name}: ${error.message}`
        };
    }
};

let saveDetailInfoDoctor = async (inputData) => {
    try {
        if (!inputData.staffId || !inputData.contentHTML
            || !inputData.contentMarkdown || !inputData.action
            || !inputData.selectedPrice || !inputData.selectedPayment
        ) {
            return {
                errCode: 1,
                errMessage: 'Missing parameter information'
            };
        } else {
            // Upsert to Markdown table
            await upsertRecord(db.Markdown, { staffId: inputData.staffId }, {
                contentHTML: inputData.contentHTML,
                contentMarkdown: inputData.contentMarkdown,
                description: inputData.description,
                staffId: inputData.staffId
            });

            // Upsert to Staff_infor table
            await upsertRecord(db.Staff_infor, { staffId: inputData.staffId }, {
                staffId: inputData.staffId,
                priceId: inputData.selectedPrice,
                paymentId: inputData.selectedPayment
            });

            // Add more tables as needed

            return {
                errCode: 0,
                errMessage: 'Save information doctor succeed!'
            };
        }
    } catch (e) {
        return {
            errCode: 1,
            errMessage: 'Error: ' + e.message
        };
    }
};

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter doctor'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    //việc dùng include nó sẽ hiểu là sẽ lấy tt thằng user 
                    //và lấy kèm theo cái tt của nó tồn tại trong bảng markdown
                    //dùng như vậy chứ ko dùng join
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        { model: db.AllCode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                        //Staff_infor
                        {
                            model: db.Staff_infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] }
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arrSchedule || !data.staffId || !data.formateDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item
                    })
                }

                //get all existing data
                //check 4 trường so sánh 2 option xem có trùng nhau hay ko 
                let existing = await db.Schedule.findAll({
                    where: { staffId: data.staffId, date: data.formateDate },
                    attributes: ['timeType', 'date', 'staffId', 'maxNumber'],
                    raw: true
                })

                // console.log('check existing', existing)
                // console.log('check schedule', schedule)


                //compare different
                //trường so sánh ở đây là timeType, date tức ta phải so sánh xem là ngày hôm nay vào khoảng thời gian đấy nó đã tồn tạ hay chưa
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }




        } catch (e) {
            reject(e)
        }
    }
    )
}

let getScheduleByDate = (staffId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!staffId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        staffId: staffId,
                        date: date
                    },
                    //76
                    // join 2 bảng lại 
                    include: [

                        { model: db.AllCode, as: 'timeTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.User, as: 'staffData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: true,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }

        } catch (e) {
            reject(e)
        }

    })
}

//81
let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters (staffId)'
                })
            } else {
                let data = await db.Staff_infor.findOne({
                    where: { staffId: idInput },
                    attributes: {
                        exclude: ['id', 'staffId']
                    },
                    include: [
                        { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },

                    include: [
                        { model: db.AllCode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                        //Staff_infor
                        {
                            model: db.Staff_infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] }
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e)
        }

    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById
}