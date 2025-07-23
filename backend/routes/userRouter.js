// External Module
const express = require("express");
const userRouter = express.Router();


// Local Module
const userController = require("../controllers/userController");


userRouter.get("/current-user", userController.getCurrentUser);

module.exports = userRouter;