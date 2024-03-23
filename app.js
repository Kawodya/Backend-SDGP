// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const cors = require("cors");
const app = express();
const port = 8000;


const corsOptions = {
    origin: "http://localhost:5173",
};
  
connectDB();


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
  