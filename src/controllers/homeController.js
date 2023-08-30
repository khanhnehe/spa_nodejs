//luôn truyền 2 tham số là request và response
let getHomePage = (req, res) => {
  return res.render("homepage.ejs"); //giải thích
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
};
