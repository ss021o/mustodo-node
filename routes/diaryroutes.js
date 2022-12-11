const connection = require("../db/connect/config");

// TODO : 오늘 날찌 일기 불러오기
// TODO : 전체 일기 불러오기
// TODO : 공개된 일기 불러오기(전체)
// TODO : 일기 생성하기
// TODO : 일기 수정하기
// TODO : 일기 삭제하기
// TODO : 일기 좋아요 / 응원 누르기
// TODO : 해당 일기 댓글 불러오기

exports.getOpenDiary = function (req, res) {
  connection.query(
    "SELECT diary_item.*, todouser.profile, todouser.nickname, todouser.mymsg  FROM diary_item, todouser WHERE diary_item.isOpen=1 AND (todouser.id = diary_item.user_id);",
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

exports.createDiary = function (req, res) {
  var nickname = req.params.nickname

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
    "SELECT * FROM todouser WHERE nickname = ?",
    [nickname],
    function (error, results, fields) {
      if (error) {
        isOK = false;
      } else {
        if (results.length > 0) {
          var user_id = results[0].id;

          var diary_item = {
            user_id: user_id,
            title: req.body.title,
            contents: req.body.content,
            date: req.body.date,
            created: today,
            updated: today,
            isOpen: req.body.isOpen,
            img: "",
            liked: 0
          };

          connection.query(
            "INSERT INTO diary_item SET ?",
            diary_item,
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

exports.getDiaryDay = function (req, res) {
  // console.log(asdf);
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
    `SELECT diary_item.* FROM diary_item, todouser WHERE diary_item.date='${startDate}' AND todouser.nickname=?;`,
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