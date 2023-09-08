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

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
};
