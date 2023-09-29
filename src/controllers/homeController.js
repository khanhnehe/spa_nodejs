import db from "../models/index";
import CRUDService from "../services/CRUDService";

//luôn truyền 2 tham số là request và response
let getHomePage = async (req, res) => {
  //bắt exception
  //sau này mỗi lần connect đến db ta sẽ dùng try and catch
  try {
    //doc
    let data = await db.User.findAll();

    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    }); //doc
  } catch (e) {
    console.log(e);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("post crud from server");
};
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();

  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserIntoId(userId);
    //check userData not found

    return res.render("edit_crud.ejs", {
      //biến user sẽ được hiểu bên file view, ở đây user đặt tên là abc j cx đc
      //giá trị của biến userData đã đc gán cho cái use này rồi
      user: userData,
    });
  } else {
    return res.send("ko tìm thấy user");
  }
};

let postEditCRUD = async (req, res) => {
  //hàm req.body giúp we có thể lấy đc tất cả các input đã đặt cái name
  //ta đặt name là gì thì req.body chấm name đó thì sẽ ra đc số liệu đó
  let data = req.body;
  let allUser = await CRUDService.updateUserData(data); //muốn hàm này trả ra 1 user cho mk
  //return giống thằng displayGetCRUD vì ta cần về trang tt của user

  return res.render("displayCRUD.ejs", {
    dataTable: allUser,
  });
};
let deleteUserById = async (req, res) => {
  //trước tiên để xóa ta cần lấy ra thằng id
  //dựa vào thằng id để biết xóa user nào
  let userId = req.query.id;
  if (userId) {
    await CRUDService.deleteUserById(userId);
    return res.send("Successful deletion!");
  } else {
    return res.send("User not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  postEditCRUD: postEditCRUD,
  deleteUserById: deleteUserById,
};
