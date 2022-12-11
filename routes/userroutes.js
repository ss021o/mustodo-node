const e = require("express");
const connection = require("../db/connect/config");

// TODO : 오늘 남은 할 일
// TODO : 오늘 완료한 할 일
// TODO : 이번 달 완료한 할 일
// TODO : 이번 달 미완료한 할 일
// TODO : 프로필 변경하기 (이미지,닉네임)
// TODO : 목표 설정하기(유저-mymsg)
// TODO : 알림 모아보기

//오늘 할 일 불러오기
exports.getTodayTodoCounts = function (req, res) {
  var nickname = req.params.nickname;

  var today = Math.floor(Date.now() / 1000);

  var checkDate = new Date(today * 1000);
  var year = checkDate.getFullYear();
  var month =
    checkDate.getMonth() + 1 >= 10
      ? checkDate.getMonth() + 1
      : "0" + checkDate.getMonth() + 1;
  var day =
    checkDate.getDate() >= 10 ? checkDate.getDate() : "0" + checkDate.getDate();

  var startDate = `${year}-${month}-${day}`;

  connection.query(
    "SELECT COUNT(*) AS total FROM todo_item WHERE todo_item.user_id = (SELECT id FROM todouser WHERE nickname = ? ) AND (todo_item.todoDate = ? );",
    [nickname, startDate],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          var total = results[0].total;

          connection.query(
            "SELECT COUNT(isCheck) AS checked  FROM todo_item WHERE todo_item.user_id = (SELECT id FROM todouser WHERE nickname = ?) AND isCheck=1 AND (todo_item.todoDate = ?);",
            [nickname, startDate],
            function (err, results, fields) {
              if (err) {
                res.send({
                  code: 400,
                  failed: "error ocurred : " + error,
                });
              } else {
                if (results.length > 0) {
                  var checked = results[0].checked;

                  connection.query(
                    "SELECT COUNT(isCheck) AS notfinish FROM todo_item WHERE todo_item.user_id = (SELECT id FROM todouser WHERE nickname = ? ) AND isCheck=0 AND (todo_item.todoDate < ? );",
                    [nickname, startDate],
                    function (err, results, fields) {
                      if (err) {
                        res.send({
                          code: 400,
                          failed: "error ocurred : " + error,
                        });
                      } else {
                        if (results.length > 0) {
                          var notfinish = results[0].notfinish;

                          var todayChart = {
                            checked: checked,
                            notfinish: notfinish,
                            notchecked: total - checked,
                          };
                          res.send({
                            code: 200,
                            data: todayChart,
                          });
                        }
                      }
                    }
                  );
                }
              }
            }
          );
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

exports.getMonthTotalStats = function (req, res) {
  var nickname = req.params.nickname;
  var checkedDate = req.params.date;

  var date = checkedDate.split("-");

  //var checkDate = new Date(checkedDate * 1000);
  //var year = checkDate.getFullYear();
  var year = date[0];

  //   var month =
  //   checkDate.getMonth() + 1 >= 10
  //     ? checkDate.getMonth() + 1
  //     : "0" + checkDate.getMonth() + 1;

  var month = Number(date[1]) >= 10 ? Number(date[1]) : "0" + Number(date[1]);

  let lastDate = new Date(year, month, 0);

  var startDate = `${year}-${month}-01`;
  var endDate = `${year}-${month}-${lastDate.getDate()}`;

  connection.query(
    `SELECT todoDate, COUNT(*) AS total FROM todo_item WHERE user_id = (SELECT id FROM todouser WHERE nickname = ? ) AND (todoDate >= '${startDate}' AND todoDate <= '${endDate}' ) GROUP BY todoDate ;`,
    [nickname],
    function (error, results, fields) {
      console.log(fields);
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
            msg: "no Data",
          });
        }
      }
    }
  );
};

exports.getMonthCheckedStats = function (req, res) {
  var nickname = req.params.nickname;
  var checkedDate = req.params.date;

  var date = checkedDate.split("-");

  //var checkDate = new Date(checkedDate * 1000);
  //var year = checkDate.getFullYear();
  var year = date[0];

  //   var month =
  //   checkDate.getMonth() + 1 >= 10
  //     ? checkDate.getMonth() + 1
  //     : "0" + checkDate.getMonth() + 1;

  var month = Number(date[1]) >= 10 ? Number(date[1]) : "0" + Number(date[1]);

  let lastDate = new Date(year, month, 0);

  var startDate = `${year}-${month}-01`;
  var endDate = `${year}-${month}-${lastDate.getDate()}`;
  connection.query(
    `SELECT todoDate, COUNT(isCheck) AS checked FROM todo_item WHERE user_id = (SELECT id FROM todouser WHERE nickname = ? ) AND isCheck = 1 AND (todoDate >='${startDate}' AND todoDate<='${endDate}') GROUP BY todoDate;`,
    [nickname],
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
            msg: "no Data",
          });
        }
      }
    }
  );
};

exports.setGoal = function (req, res) {
  var nickname = req.params.nickname;
  var mymsg = req.body.mymsg;
  var today = Math.floor(Date.now() / 1000);

  connection.query(
    "UPDATE todouser SET mymsg=?, recented=? WHERE nickname=?",
    [mymsg, today, nickname],
    function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        console.log(results);

        res.send({
          code: 200,
          success: "SUCCESS_UPDATE",
        });
      }
    }
  );
};
