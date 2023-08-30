import express from "express";

let configViewEngine = () => {
  app.use(express.static("./src/public"));
  // như này nodejs mới hiểu đc rằng we dùng cái view engine có tên là ejs
  //ejs là cái thư viện mà ta đã cài đặt r
  app.set("view engine", "ejs");

  //we phải tìm các file ejs trong folder views
  //bắt buộc we phải viết các file là 'phi ếch like ợch' trong folder views
  //dường link đến thư mục views ./src/view
  app.set("views", "./src/views");
};

module.exports = configViewEngine;
