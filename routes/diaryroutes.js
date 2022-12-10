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
