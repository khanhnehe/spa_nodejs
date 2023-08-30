import express from "express";
import bodyParser from "body-parser"; // thư viện hổ trọ cho we ta có thể lấy đc các tham số mà phía client sd cho we
import viewEngine from "./config/viewEngine";
import initWebRouters from "./route/web";
require("dotenv").config(); // cái này giúp we chạy dòng này process.env.PORT

let app = express();

//config app
//trước khi config app sẽ cấu hình các tham số mà phía client gửi lên

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config app
viewEngine(app);
initWebRouters(app);

//bắt buộc có để app chạy, như vậy ta sẽ lấy cái tham số có tên là port ở trong file env
let port = process.env.PORT || 6969;
//port === undefined => port = 6969
app.listen(port, () => {
  console.log("back end nodejs running on the port: ", +port);
});
