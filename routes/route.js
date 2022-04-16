const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");

route.post("/products", controller.create);
route.get("/products/:msp", controller.findOne);
route.get("/products", controller.findAll);
route.delete("/products/:msp", controller.delete);
route.put("/products/:msp", controller.update);
route.put("/order", controller.order);
route.post("/comment/:id", controller.comment);

module.exports = route;
