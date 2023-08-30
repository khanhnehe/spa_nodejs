//file web.js này chính là nơi mỗi 1 lần mà we truy cập vào 1 đg link của website của mk thì nó sẽ chạy vào cái file này đầu tiên
import express from "express";

let router = express.Router();

//tất cả các route đc viết  tại đây
//app ở đây chính là 1 cái biến
//hình dung rằng 1 server nó bằng 1 ứng dụng thì we sẽ truyền ứng dụng của server vào trong hàm này
let initWebRouters = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello word with khanh dep");
  });
  return app.use("/", router);
};

// để sd cái hàm này bên ngoài web.js cần làm như dưới:
module.exports = initWebRouters;
