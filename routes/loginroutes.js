const bcrypt = require("bcrypt-nodejs");
const connection = require("../db/connect/config");

// TODO : 로그인
// TODO : 로그인 시, 회원정보 넘기기

// TODO : 회원가입
// TODO : 이메일 인증 전송
// TODO : 이메일 인증하기

exports.checkUser = function (req, res) {
  var email = req.body.email;

  connection.query(
    "SELECT * FROM todouser WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) {
        console.log(email);
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          var users = {
            id: results[0].id,
            email: email,
            nickname: results[0].nickname,
            mymsg: results[0].mymsg,
            profile: results[0].profile,
          };

          return res.send({
            code: 200,
            result: users,
          });
        } else {
          res.send({
            code: 400,
            msg: "회원이 아닙니다.",
          });
        }
      }
    }
  );
};

exports.authEmail = function (req, res) {
  var email = req.body.email;
  var code = req.body.code;

  connection.query(
    "SELECT code FROM todouser WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred : " + error,
        });
      } else {
        if (results.length > 0) {
          if (code == results[0].code) {
            connection.query(
              "UPDATE todouser SET isAuth=true WHERE email = ?",
              [email],
              function (error, results, fields) {
                if (error) {
                  res.send({
                    code: 400,
                    failed: "error ocurred : " + error,
                  });
                } else {
                  res.send({
                    code: 200,
                    data: "SUCCESS",
                  });
                }
              }
            );
          } else {
            res.send({
              code: 400,
              data: "NO_RIGHT_CODE",
            });
          }
        } else {
          res.send({
            code: 400,
            msg: "회원이 아닙니다.",
          });
        }
      }
    }
  );
};

function generateRandomCode(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}

exports.register = function (req, res) {
  var isAuth = false;
  var code = generateRandomCode(8);
  var salt = bcrypt.genSaltSync(10);
  var today = Math.floor(Date.now() / 1000);

  bcrypt.hash(req.body.password, salt, null, (err, password) => {
    var users = {
      nickname: req.body.nickname,
      email: req.body.email,
      password: password,
      isAuth: isAuth,
      code: code,
      created: today,
      recented: today,
    };

    connection.query(
      "INSERT INTO todouser SET ?",
      users,
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
  });
};

exports.login = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var today = Math.floor(Date.now() / 1000);

  connection.query(
    "SELECT * FROM todouser WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) {
        console.log("login : ", error);
        return res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        // console.log('The solution is: ', results);
        if (results.length > 0) {
          if (results[0].isAuth == 0) {
            return res.send({
              code: 205,
              errorCode: "UNAUTHORIZED_ACCESS",
            });
          } else {
            const isCorrectPwd = bcrypt.compareSync(
              password,
              results[0].password
            );

            if (isCorrectPwd) {
              var users = {
                id: results[0].id,
                email: email,
                nickname: results[0].nickname,
                mymsg: results[0].mymsg,
                profile: results[0].profile,
              };

              connection.query(
                "UPDATE todouser SET recented=? WHERE email=?",
                [today, email],
                function (error, results, fields) {
                  if (error) {
                    console.log("error ocurred", error);
                    res.send({
                      code: 400,
                      failed: "error ocurred : " + error,
                    });
                  } else {
                    res.send({
                      code: 200,
                      success: "login sucessfull",
                    });
                  }
                }
              );
            } else {
              return res.send({
                code: 204,
                errorCode: "LOGIN_FAILED_ERROR",
              });
            }
          }
        } else {
          return res.send({
            code: 204,
            errorCode: "Email does not exists",
          });
        }
      }
    }
  );
};
