import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })

    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)


    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postSaveInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        //({response}) ko cần dùng 2 dấu ngoặc vì nó đã là 1 object rồi
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {

        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}
let bulkCreateSchedule = async (req, res) => {
    try {

        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}

let getScheduleByDate = async (req, res) => {
    try {

        let infor = await doctorService.getScheduleByDate(req.query.staffId);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}

//81
let getExtraInforDoctorById = async (req, res) => {
    try {

        let infor = await doctorService.getExtraInforDoctorById(req.query.staffId);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}
let getProfileDoctorById = async (req, res) => {
    try {

        let infor = await doctorService.getProfileDoctorById(req.query.staffId);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}
let getListCustomerForDoctor = async (req, res) => {
    try {
        // biết đc là bác sĩ nào và vào time nào
        let infor = await doctorService.getListCustomerForDoctor(req.query.staffId, req.query.date);
        return res.status(200).json(infor)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })

    }
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postSaveInfoDoctor: postSaveInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListCustomerForDoctor: getListCustomerForDoctor
}