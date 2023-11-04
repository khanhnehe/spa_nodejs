import express from "express";
import bodyParser from "body-parser"; // thư viện hổ trọ cho we ta có thể lấy đc các tham số mà phía client sd cho we
import viewEngine from "./config/viewEngine";
import initWebRouters from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";

require("dotenv").config(); // cái này giúp we chạy dòng này process.env.PORT

let app = express();
app.use(cors({ origin: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// //app.use(function (req, res, next)  như này có nghĩa là ta định nghĩa 1 cái 
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });


//config app
//trước khi config app sẽ cấu hình các tham số mà phía client gửi lên
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
viewEngine(app);
initWebRouters(app);

connectDB();

//bắt buộc có để app chạy, như vậy ta sẽ lấy cái tham số có tên là port ở trong file env
let port = process.env.PORT || 6969;
//port === undefined => port = 6969
app.listen(port, () => {
  console.log("back end nodejs running on the port: ", +port);
});
