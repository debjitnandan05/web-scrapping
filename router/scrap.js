const express = require("express");
const scrapRouter = express.Router();
const { auth } = require("../middleware/auth");
const { scrapUrl } = require("../controller/scrapUrl");


scrapRouter.post("/", scrapUrl);


module.exports = scrapRouter;