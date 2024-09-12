const express = require("express");
const Router = express.Router();
const ErrorRes = require("../middleware/errorRes");

Router.get("/:id", (req, res, next) => {
  const pool = req.pool;
  const roomID = req.params.id;

  pool.getConnection((err, con) => {
    if (err) {
      con.release();
      next(new ErrorRes("connection Error", 500));
    }

    const queryHandle = (err, result) => {
      if (err) {
        con.release();
        next(new ErrorRes("Query Error", 500));
      } else {
        con.release();
        res.json({
          res: result,
          timestamp: Date.now(),
          err: err
        });
      }
    };

    con.query(
      "SELECT * FROM `visitor` WHERE `room_id` = ?",
      [roomID],
      queryHandle
    );
  });
});

Router.post("/visitor-update", (req, res, next) => {
  const pool = req.pool;
  const body = req.body;

  pool.getConnection((err, con) => {
    if (err) {
      con.release();
      next(new ErrorRes("connection Error", 300));
    }

    const queryHandle = (err, result) => {
      if (err) {
        con.release();
        next(new ErrorRes("Query Error", 500));
      } else {
        con.release();
        res.json({
          res: result,
          timestamp: Date.now(),
          err: err
        });
      }
    };

    con.query(
      "INSERT INTO `visitor` (`room_id`, `user_current`, `user_new`, `user_diff`) VALUES (?, ?, ?, ?)",
      [
        body.roomID,
        body.userCurrent,
        body.userCurrent + body.userDiff,
        body.userDiff,
      ],
      queryHandle
    );
  });
});

Router.put("/reset", (req, res, next) => {
  const pool = req.pool;
  const roomID = req.body.roomID;

  pool.getConnection((err, con) => {
    if (err) {
      con.release();
      next(new ErrorRes("connection Error", 500));
    }

    const queryHandle = (err, result) => {
      if (err) {
        con.release();
        next(new ErrorRes("Query Error", 500));
      } else {
        con.release();
        res.json({
          res: result,
          timestamp: Date.now(),
          err: err
        });
      }
    };

    con.query(
      "DELETE FROM `visitor` WHERE `room_id` = ?",
      [roomID],
      queryHandle
    );
  });
});

module.exports = Router;
