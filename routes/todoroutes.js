const connection = require("../db/connect/config");
const moment = require("moment-timezone");

//오늘 할 일 리스트 가져오기
//특정일 할 일 리스트 가져오기(DAY)
//특정월 할 일 개수 가져오기(MONTH)
//TODO : 공개된 할 일 리스트 가져오기(전체 유저)
//TODO : 공개된 할 일 리스트 가져오기(유저 : 월별)
//TODO : 공개된 할 일 리스트 가져오기(유저 : 일자)
//TODO : 공개된 할 일 리스트 가져오기(유저 : 오늘)
//할 일 카테고리 생성하기
//TODO : 할 일 카테고리 수정하기
//TODO : 할 일 카테고리 삭제하기
//할 일 카테고리 불러오기
//할 일 생성하기
//TODO : 할 일 완료하기
//TODO : 할 일 수정하기
//TODO : 할 일 삭제하기

const getCurrentTime = () => {
  var m = moment().tz("Asia/Seoul"); // ← 이곳이 포인트
  return m.format("YYYY-MM-DD HH:mm:ss");
};

//할 일 카테고리 생성하기
exports.setTodoGroup = function (req, res) {
  var nickname = req.params.nickname;

  connection.query(
    "SELECT * FROM todouser WHERE nickname = ?",
    [nickname],
    function (error, results, fields) {
      if (error) {
        isOK = false;
      } else {
        if (results.length > 0) {
          var user_id = results[0].id;

          var todoGroup = {
            user_id: user_id,
            title: req.body.title,
            color: req.body.color,
          };

          connection.query(
            "INSERT INTO todo_group SET ?",
            todoGroup,
            function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send({
                  code: 400,
                  failed: "error ocurred : " + error,
                });
              } else {
                console.log("The solution is: ", results);
                res.send({
                  code: 200,
                  id: results.insertId,
                });
              }
            }
          );
        } else {
          var msg = "회원이 아닙니다.";
          isOK = false;
        }
      }
    }
  );
};

//할 일 카테고리 불러오기
exports.getTodoGroup = function (req, res) {
  var nickname = req.params.nickname;

  connection.query(
    "SELECT * FROM todo_group WHERE user_id = (SELECT id FROM todouser WHERE nickname = ?)",
    [nickname],
    function (error, results, fields) {
      if (error) {
        isOK = false;
      } else {
        if (results.length > 0) {
          res.send({
            code: 200,
            data: results,
          });
        } else {
          res.send({
            code: 200,
            success: "NO TODO GROUP",
          });
        }
      }
    }
  );
};

//할 일 생성하기
exports.setTodo = function (req, res) {
  var nickname = req.params.nickname;
  var today = Math.floor(Date.now() / 1000);

  connection.query(
    "SELECT * FROM todouser WHERE nickname = ?",
    [nickname],
    function (error, results, fields) {
      if (error) {
        isOK = false;
      } else {
        if (results.length > 0) {
          var user_id = results[0].id;

          var todoItem = {
            user_id: user_id,
            group_id: req.body.group_id,
            title: req.body.title,
            todoDate: req.body.todoDate,
            todoTime: req.body.todoTime,
            created: today,
            updated: today,
            isCheck: false,
            isOpen: req.body.isOpen,
            isLevel: req.body.isLevel,
          };

          connection.query(
            "INSERT INTO todo_item SET ?",
            todoItem,
            function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send({
                  code: 400,
                  failed: "error ocurred : " + error,
                });
              } else {
                console.log("The solution is: ", results);
                res.send({
                  code: 200,
                  success: "sucessful",
                });
              }
            }
          );
        } else {
          var msg = "회원이 아닙니다.";
          isOK = false;
        }
      }
    }
  );
};

//오늘 할 일 불러오기
exports.getTodayTodo = function (req, res) {
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

  //SELECT todo_item.* , todo_group.title AS cate, todo_group.color FROM todo_item, todo_group WHERE todo_item.user_id = (SELECT id FROM todouser WHERE nickname = "testUser") AND todo_group.id = todo_item.group_id AND (todo_item.todoDate = "2022-12-09");

  connection.query(
    "SELECT todo_item.* , todo_group.title AS cate, todo_group.color FROM todo_item, todo_group WHERE todo_item.user_id = (SELECT id FROM todouser WHERE nickname = ? ) AND todo_group.id = todo_item.group_id AND (todo_item.todoDate = ?)",
    [nickname, startDate],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          console.log(results);
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

//월별 할 일 불러오기
exports.getMonthTodo = function (req, res) {
  var nickname = req.params.nickname;
  var checkedDate = req.params.date;

  console.log(checkedDate);
  var checkDate = new Date(checkedDate * 1000);
  var year = checkDate.getFullYear();
  var month =
    checkDate.getMonth() + 1 >= 10
      ? checkDate.getMonth() + 1
      : "0" + checkDate.getMonth() + 1;

  var day =
    checkDate.getDate() >= 10 ? checkDate.getDate() : "0" + checkDate.getDate();

  var startDate = `${year}-${month}-${day}`;

  let lastDate = new Date(year, month, 0);

  var startDate = `${year}-${month}-01`;
  var endDate = `${year}-${month}-${lastDate.getDate()}`;

  //SELECT todoDate, COUNT(*) FROM todo_item WHERE user_id = (SELECT id FROM todouser WHERE nickname = 'testUser') AND (todoDate >= "2022-12-01" AND todoDate<="2022-12-31") GROUP BY todoDate;

  connection.query(
    `SELECT todoDate, COUNT(*) as Count  FROM todo_item WHERE user_id = (SELECT id FROM todouser WHERE nickname = ?) AND (todoDate >= '${startDate}' AND todoDate<='${endDate}' ) GROUP BY todoDate;`,
    [nickname],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          console.log(results);

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

//선택 날짜 할 일 불러오기
exports.getDayTodo = function (req, res) {
  var nickname = req.params.nickname;
  var checkedDate = req.params.date;

  var checkDate = new Date(checkedDate * 1000);
  var year = checkDate.getFullYear();
  var month =
    checkDate.getMonth() + 1 >= 10
      ? checkDate.getMonth() + 1
      : "0" + checkDate.getMonth() + 1;
  var day =
    checkDate.getDate() >= 10 ? checkDate.getDate() : "0" + checkDate.getDate();

  var startDate = `${year}-${month}-${day}`;

  connection.query(
    `SELECT todo_item.*, todo_group.title as cate, todo_group.color FROM todo_item LEFT JOIN todo_group ON todo_item.group_id=todo_group.id LEFT JOIN todouser ON todouser.id=todo_item.user_id WHERE todo_item.todoDate='${startDate}';`,
    [nickname],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          console.log(results);
          res.send({
            code: 200,
            data: results,
          });
        } else {
          res.send({
            code: 205,
            msg: "NO TO DO",
          });
        }
      }
    }
  );
};

//할 일 완료하기
exports.setTodoCheck = function (req, res) {
  var name = req.params.nickname
  var todoId = req.params.id
  var check = req.params.checked == 'true' ? 1 : 0

  console.log(todoId, check);

  connection.query(
    `UPDATE todo_item SET isCheck='${check}' WHERE todo_item.id=?`,[todoId],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        console.log(results);
        if (results.length > 0) {
          console.log(results);
          res.send({
            code: 200
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

exports.getOpenTodo = function (req, res) {
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
    `SELECT todo.title, todouser.nickname, todouser.profile, todouser.mymsg, todo_group.color FROM todo_item as todo LEFT JOIN todo_group ON todo_group.id=todo.group_id JOIN todouser ON todo.user_id=todouser.id WHERE todo.isOpen=1 AND todo.isCheck=1 AND todo.todoDate='${startDate}'`,
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
            msg: results,
          });
        } else {
          res.send({
            code: 200,
            msg: "NOT_OPEN_TODO",
          });
        }
      }
    }
  );
};
