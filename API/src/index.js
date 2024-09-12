// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const VisitorRouter = require("./routes/visitor.js");
const RoomRouter = require("./routes/room.js");
const { ErrorHandle } = require("./middleware/errorHandle.js");

dotenv.config();

const app = express();
const port = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use("/api/v1/visitor", VisitorRouter);
app.use("/api/v1/room", RoomRouter);

app.use(ErrorHandle);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://127.0.0.1:${port}`);
});
 