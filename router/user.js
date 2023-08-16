const express = require("express");
const userRouter = express.Router();
const { signUp, signIn, getUserDetails } = require("../controller/user");
const { auth } = require("../middleware/auth");

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.get("/get-user-details", auth, getUserDetails);

module.exports = userRouter;