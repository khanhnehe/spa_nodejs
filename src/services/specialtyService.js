const db = require("../models")

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.price
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })

            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    price: data.price,

                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Create Specialty success'
                })
            }

        } catch (e) {
            reject(e)
        }
    }

    )


}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                console.log('ooooo', data)
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e)
        }

    })
}

//id lấy bnagwf id của Staff_infor specialtyId
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown']
                });

                if (data) {
                    let staffSpecialty = [];
                    if (location === 'ALL') {
                        staffSpecialty = await db.Staff_infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['staffId']
                        });
                    }
                    else {
                        //find by location
                        staffSpecialty = await db.Staff_infor.findAll({
                            where: {
                                specialtyId: inputId,
                                specialtyId: location
                            },
                            attributes: ['staffId', 'specialtyId']
                        });
                    }

                    data.staffSpecialty = staffSpecialty;
                } else data = {};
                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}