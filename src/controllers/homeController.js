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
  console.log("...................");
  console.log(data);

  console.log("...................");

  return res.render("displayCRUD.ejs", {
    //Truyền data sang file view tương tự như ta import 1 function,
    //khi muốn truyền 1 biến qua view thì we sẽ dùng 1 cái biến là object
    //và đặt ten cho nó
    dataTable: data, // biến dataTable sẽ có giá trị = biến data phía trên ta truyền xuống
  });
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
};
