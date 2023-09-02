import db from "../models/index";
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

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
};
