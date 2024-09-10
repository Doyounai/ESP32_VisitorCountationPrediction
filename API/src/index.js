// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

function getFormattedDate(timestamp) {
    const date = new Date(timestamp);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

app.get("/", (req, res, next) => {
  connection.query("SELECT * FROM `visitor`", (error, result) => {
    res.json({
      res: result,
      error: error,
    });
  });
});

app.post("/visitor-update", (req, res, next) => {
  Promise.resolve()
    .then(() => {
      const body = req.body;

      connection.query(
        "INSERT INTO `visitor` (`room_id`, `user_current`, `user_new`, `user_diff`, `timestamp`) VALUES (?, ?, ?, ?, ?)",
        [
          body.roomID,
          body.userCurrent,
          body.userCurrent + body.userDiff,
          body.userDiff,
          getFormattedDate(body.timestamp),
        ],
        (err, result) => {
          res.json({
            res: result,
            err: err,
          });
        }
      );
    })
    .catch(next);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://127.0.0.1:${port}`);
});
