import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"

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


  return app.use("/", router);
};
module.exports = initWebRouters;
