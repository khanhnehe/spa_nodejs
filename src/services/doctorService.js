import db from "../models/index";

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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById
}