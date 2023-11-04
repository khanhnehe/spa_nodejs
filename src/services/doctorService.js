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

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}