require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });


    let info = await transporter.sendMail({
        from: '"NK Spa&Clinic" <nguyenngockhanh2001hg@gmail.com>', // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thông tin lịch hẹn", // Subject line
        html: `<b>Xin chào ${dataSend.patientName}!</b>
        <p>Đây là thông tin về lịch hẹn của bạn ở  NK Spa&Clinic</p>
        <div><p>Người phụ trách: ${dataSend.staffName}</p></div>
        <div><p>Thời gian:${dataSend.time} </p></div>
        <p>Nếu thông tin trên chính xác vui lòng click vào link dưới để xác nhận</p>
        <div><a href=${dataSend.receiversLink} target="_bank" > Click vào đây
        </a></div>
        <div><p>Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!</p></div>
        
        `, // html body
    });

}
async function main() {
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail
}