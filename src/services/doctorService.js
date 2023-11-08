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

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.staffId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter information'

                })
            }
            else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    staffId: inputData.staffId
                }
                )

                resolve({
                    errCode: 0,
                    errMessage: 'Save information doctor succeed! '
                })
            }


        } catch (e) {
            reject(e)
        }
    })

}
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

                    ],
                    raw: true,
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

                //convert date
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item;
                    })
                }
                //compare different
                //trường so sánh ở đây là timeType, date tức ta phải so sánh xem là ngày hôm nay vào khoảng thời gian đấy nó đã tồn tạ hay chưa
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule
}