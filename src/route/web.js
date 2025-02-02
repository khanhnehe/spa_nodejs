import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController";
let router = express.Router();

let initWebRouters = (app) => {
  //giải thích trong doc
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);

  router.get("/edit-crud", homeController.getEditCRUD); // trang điền tt edit
  router.post("/post-edit-crud", homeController.postEditCRUD);
  // trang trả ra tt sau khi edit cập nhật vào trang /get-crud

  router.get("/delete-crud", homeController.deleteUserById);

  //kể từ bấy giờ những cái route hay nới cách khác 
  //những cái api nào mà ta sd bên phía react thì ta sẽ bắt đầu bằng tiền tố /api/ để cho nó phân biêt vs cái ta làm từ trước tới nay
  router.post('/api/login', userController.handleLogin)
  router.post('/api/register', userController.handleCreateNewUser)
  router.get('/api/get-all-users', userController.handleGetAllUsers)
  router.post('/api/post-create-new-user', userController.handleCreateNewUser)
  router.put('/api/put-edit-user', userController.handleEditUser)
  router.delete('/api/delete-user', userController.handleDeleteUser)

  //redux
  router.get('/api/allcode/', userController.getAllCode)

  //doctor(staff)63
  router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
  //67
  router.get('/api/get-all-doctor', doctorController.getAllDoctor)
  router.post('/api/save-info-doctor', doctorController.postSaveInfoDoctor)
  //68
  router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)

  //74 
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
  //75 //87 lấy cái này để lấy name staff
  router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
  //81
  router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
  //83
  router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
  //84 tự động tạo tk khi user đặt lịch hẹn
  //patient là khách hàng
  router.post('/api/patient-book-appointment', patientController.postBookAppointment)

  //88 xác minh bôk appointment

  router.post('/api/verify-book-appointment', patientController.verifyBookAppointment)

  //90
  router.post('/api/create-new-specialty', specialtyController.createSpecialty)
  //91
  router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)
  //94
  router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

  //98 get danh sách custom đặt hẹn
  router.get('/api/get-list-customer-for-doctor', doctorController.getListCustomerForDoctor)



  return app.use("/", router);
};
module.exports = initWebRouters;
