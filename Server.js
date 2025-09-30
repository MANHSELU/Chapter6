const express = require("express");
const app = express();
port=3000;
const connectDB = require("./config/database");
const bodyParser = require("body-parser");

const userRouter = require('./router/index.booking');
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
userRouter(app);
connectDB(); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});