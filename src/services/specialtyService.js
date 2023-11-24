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

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty
}