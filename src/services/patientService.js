import { response } from "express";
import db from "../models/index";
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (staffId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&staffId=${staffId}`;
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.timeType
                || !data.lastName || !data.address || !data.phonemumber) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                //gọi email
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    receiversEmail: data.email,
                    patientName: data.lastName,
                    time: data.timeString,
                    staffName: data.staffName,
                    receiversLink: buildUrlEmail(data.staffId, token),
                })



                //upsert patient -> nếu như nó tìm thấy email nó trả ra user -> ko thì create user
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        phonemumber: data.phonemumber,
                        lastName: data.lastName,
                        // date: data.date
                    }
                })
                //create booking record
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
                            timeType: data.timeType,
                            token: token
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

let verifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.staffId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        staffId: data.staffId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update lịch hẹn thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'cuộc hẹn đã được kích hoạt hoặc không tồn tại',
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    verifyBookAppointment: verifyBookAppointment
}