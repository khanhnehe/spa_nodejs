import express from "express";

import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRouters = (app) => {
  //giải thích trong doc
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);

  return app.use("/", router);
};
module.exports = initWebRouters;
