const express = require("express");
const app = express();
const PORT = 5000 || process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./router/user");
const scrapRouter = require("./router/scrap");


app.use(cors());
app.use(express.urlencoded({extended : true})); 
app.use(express.json());

//db
const db = process.env.MONGO_URL || 'mongodb://localhost:27017/demoDB'

mongoose
  .set("strictQuery", true)
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Db is Connected"))
  .catch((err) => console.log(err));

//routers
app.use("/api/user", userRouter);
app.use("/api/scrapUrl", scrapRouter);


// for handel error
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});