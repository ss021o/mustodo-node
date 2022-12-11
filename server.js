const express = require("express");

const TZ = require("set-tz");

const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

const login = require("./routes/loginroutes");
const todo = require("./routes/todoroutes");
const diary = require("./routes/diaryroutes");
const user = require("./routes/userroutes");
const famous = require("./routes/famousroutes");

const PORT = 50471;

const maria = require("./db/connect/config");

const app = express();

maria.connect();

app.set("port", PORT);

TZ("Asia/Seoul");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var router = express.Router();

// test route
app.get("/", function (req, res) {
  res.json({ message: "Welcome to MUSTODO" });
});

router.get("/", function (req, res) {
  res.json({ message: "API-START" });
});

// TODO : USER
router.post("/register", login.register); //ok
router.post("/authorization", login.authEmail); //ok //but, need to email send
router.post("/login", login.login); //ok
router.post("/user", login.checkUser); //ok

// TODO : TODO
/* 카테고리 */
router.post("/:nickname/todogroup", todo.setTodoGroup); //ok
router.get("/:nickname/todogroup", todo.getTodoGroup); //ok

router.put("/:nickname/todogroup/:id", todo.getTodoGroup);
router.patch("/:nickname/todogroup/:id/color", todo.getTodoGroup);
router.patch("/:nickname/todogroup/:id/title", todo.getTodoGroup);

router.delete("/:nickname/todogroup/:id", todo.getTodoGroup);
router.delete("/:nickname/todogroup", todo.getTodoGroup);

/* 할일 */
router.post("/:nickname/todo", todo.setTodo); //ok

router.get("/:nickname/todo/m/:date", todo.getMonthTodo); //ok
router.get("/:nickname/todo/d/:date", todo.getDayTodo); //ok
router.get("/:nickname/todo/t", todo.getTodayTodo); //ok

router.patch("/:nickname/todo/:id/check/:checked", todo.setTodoCheck);
router.put("/:nickname/todo/:id", todo.getTodoGroup);
router.delete("/:nickname/todo/:id", todo.getTodoGroup);

router.get("/search/:nickname/todo/m/:date", todo.getMonthTodo);
router.get("/search/:nickname/todo/d/:date", todo.getDayTodo);
router.get("/search/:nickname/todo/t", todo.getTodayTodo);
router.get("/search/todo", todo.getOpenTodo);

// TODO : Diary
router.post("/:nickname/diary", diary.createDiary);
router.get("/:nickname/diary/d/:date", diary.getDiaryDay);
// router.get("/:nickname/diary/all", diary.getAllDiary);
// router.get("/:nickname/diary", diary.getDiary);

// router.put("/:nickname/diary/:id", diary.getDiary);
// router.delete("/:nickname/diary/:id", diary.getDiary);

// router.post("/:nickname/diary/:id/:like", diary.setDiary);

// router.get("/:nickname/diary/:id/comments", diary.setDiary);
router.get("/search/diary", diary.getOpenDiary);

//TODO : FAMOUS
router.get("/famous/today", famous.getTodayFamous);
router.get("/famous/all", famous.getAllFamous);
router.get("/famous/:id/likeon", famous.getAllFamous);
router.get("/famous/:id/likeoff", famous.getAllFamous);

//TODO : USER
router.get("/:nickname/todo/stat/t", user.getTodayTodoCounts);
router.get("/:nickname/todo/stat/m/:date/all", user.getMonthTotalStats);
router.get("/:nickname/todo/stat/m/:date/checked", user.getMonthCheckedStats);
router.post("/:nickname/goal", user.setGoal);

app.use("/api", router);

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
