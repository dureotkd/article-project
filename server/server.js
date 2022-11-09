const express = require("express");
const cors = require("cors");
const session = require("express-session");

// ================== DB연결 수행 전 라이브러리 호출 ========================
const mysql = require("mysql2");
const db = mysql.createPoolCluster();
// ================== DB연결 수행 전 라이브러리 호출 ========================

const app = express();
const port = 4000;

app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true, // 도메인 달라도 쿠키 공유 받아줄게
  })
);

db.add("article_project", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "article_project",
  port: 3306,
});

app.get("/", async (req, res) => {
  const 데이터 = await new Promise(function (resolve, reject) {
    db.getConnection("article_project", function (error, connection) {
      if (error) {
        console.log("디비 연결 오류", error);
        reject(true);
      }

      connection.query("SELECT * FROM user", function (error, data) {
        if (error) {
          console.log("쿼리 오류", error);
          reject(true);
        }

        resolve(data);
      });

      connection.release();
    });
  });

  console.log(데이터);

  res.send("여기로 옵니다!");
});

app.post("/join", (req, res) => {
  const { id, pw } = req.body;

  res.send({
    code: "success",
    message: "회원가입되었습니다11111111111111",
  });
});

app.get("/test", (req, res) => {
  console.log(req.session);

  res.send("//");
});

app.post("/login", (req, res) => {
  const { id, pw } = req.body;

  res.send("/");
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
