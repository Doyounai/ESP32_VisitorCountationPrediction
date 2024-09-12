const express = require("express");
const Router = express.Router();
const ErrorRes = require("../middleware/errorRes");

//#region GET
Router.get("/", (req, res, next) => {
  const pool = req.pool;

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
          err: err,
        });
      }
    };

    con.query("SELECT * FROM `room`", queryHandle);
  });
});

Router.get("/getroom/:id", (req, res, next) => {
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
          err: err,
        });
      }
    };

    con.query(
      "SELECT * FROM `room` WHERE `room_id` = ?",
      [roomID],
      queryHandle
    );
  });
});

//#endregion

Router.post("/room-create", (req, res, next) => {
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
          err: err,
        });
      }
    };

    con.query(
      "INSERT INTO `room` (`room_name`, `user_current`) VALUE (?, ?)",
      [body.roomName, 0],
      queryHandle
    );
  });
});

Router.put("/room-update", (req, res, next) => {
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
          err: err,
        });
      }
    };

    con.query(
      "UPDATE `room` SET `user_current` = ? WHERE `room_id` = ?",
      [body.userCurrent, body.roomID],
      queryHandle
    );
  });
});

module.exports = Router;
