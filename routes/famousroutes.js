const connection = require("../db/connect/config");

// TODO : 명언 생성 / 공개 목표 생성
// 전체 명언 불러오기
// TODO : 전체 목표 불러오기

// TODO : 명언/목표 좋아요
// TODO : 명언/목표 신고하기
// TODO : 명언/목표 댓글

exports.getTodayFamous = function (req, res) {
  connection.query(
    "SELECT COUNT(*) as count FROM famous_msg;",
    [],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        var randomCount = Math.floor(Math.random() * results[0].count);
        connection.query(
          `SELECT * FROM famous_msg WHERE id = ? ;`,
          [randomCount],
          function (error, results, fields) {
            if (error) {
              res.send({
                code: 400,
                failed: "error ocurred : " + error,
              });
            } else {
              if (results.length > 0) {
                res.send({
                  code: 200,
                  data: results,
                });
              } else {
                res.send({
                  code: 200,
                  msg: "NO TO DO",
                });
              }
            }
          }
        );
      }
    }
  );
};

exports.getAllFamous = function (req, res) {
  connection.query(
    "SELECT * FROM famous_msg ORDER BY id DESC ;",
    [],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          res.send({
            code: 200,
            data: results,
          });
        } else {
          res.send({
            code: 200,
            msg: "NO TO DO",
          });
        }
      }
    }
  );
};
