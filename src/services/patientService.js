import { response } from "express";
import db from "../models/index";

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                //upsert patient -> nếu như nó tìm thấy email nó trả ra user -> ko thì create user
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })
                //có trả ra user và có user 0 
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        //nếu patientID có rồi thì ta trả user[0].id và ko làm j cả
                        where: { patientID: user[0].id },
                        //chưa có thì ta create
                        defaults: {
                            statusId: 'S1',
                            staffId: data.staffId,
                            patientID: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }

                    })
                }
                console.log('check user', user)
                resolve({
                    errCode: 0,
                    errMessage: 'Save information customer  success'
                })

            }



        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}