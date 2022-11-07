const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 4000;

const DB = {
  user: [
    {
      id: "asd",
      pw: "asd",
    },
    {
      id: "asd123",
      pw: "asd123",
    },
    {
      id: "fas123",
      pw: "fas123",
    },
  ],
};

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

app.get("/", (req, res) => {
  res.send("HELLO !!");
});

app.post("/join", (req, res) => {
  const { id, pw } = req.body;

  DB.user.push({
    id: id,
    pw: pw,
  });

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

  const user = DB.user;

  /**
   * find
   * 회원가입 성공하면
   * 세션에 findUser를 저장해야findUser
   */
  const findUser = user.find((item) => {
    return item.id === id && item.pw === pw;
  });

  // 세션 저장 =====================
  req.session.loginUser = findUser;
  req.session.save();
  // 세션 저장 =====================

  res.send("/");
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
