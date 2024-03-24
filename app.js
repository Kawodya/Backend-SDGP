// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const cors = require("cors");
const app = express();
const port = 8000;

const userRouter = require("./routes/UserRoutes");
const brandRouter = require("./routes/BrandRoutes");
const drugRouter = require("./routes/DrugRoutes");
const productRouter = require("./routes/ProductRoutes");
const prescriptionRouter = require("./routes/PrescriptionRoutes");
const billRouter = require("./routes/BillRoutes");

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//databse config
connectDB();

app.use("/api/users", userRouter);
app.use("/api/brands", brandRouter);
app.use("/api/drugs", drugRouter);
app.use("/api/products", productRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/bills", billRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
