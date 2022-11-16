import axios from "axios";
import React from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";

// 도메인 달라도 쿠키공유해줄게
axios.defaults.withCredentials = true;

function Write() {
  const { loginUser } = React.useContext(StoreContext);

  const navigation = useNavigate();

  /**
   * 제목,내용 입력 state에 저장한 후
   * 작성하기 누르면 서버에 요청보내기!!
   * 다 하신분들은 Mysql article테이블에 저장까지 해주세요~
   */

  const [data, setData] = React.useState({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 작성 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.code === "success") {
        alert(response.data.message);
        navigation("/");
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
      <h2>게시글 작성</h2>
      <h3>제목</h3>
      <input name="title" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        name="body"
        onChange={데이터변경}
        cols="50"
        rows="10"
      ></textarea>
      <button onClick={작성} type="button" style={{ marginTop: 12 }}>
        작성하기
      </button>
    </div>
  );
}

function Join() {
  const navigation = useNavigate();

  // useState는 항상위
  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 회원가입 = async () => {
    /**
     * GET : 가져올떄
     * POST : 뭐를 생성할떄
     */
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          navigation("/login");
        }
      })
      .catch((e) => {
        console.log("join Error", e);
      });

    // 여기서 내가 입력한 값을 console.log로 확인해주세요
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

function Login() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data,
    })
      .then((res) => {
        alert(res.data.message);

        if (res.data.code === "success") {
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.log("로그인에러", e);
      });
  };

  return (
    <div>
      <input name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Article() {
  const { seq } = useParams();

  const [article, setArticle] = React.useState({});

  const 게시판상세정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/article_row",
      params: {
        seq: seq,
      },
    }).then((response) => {
      setArticle(response.data);
    });
  };

  React.useEffect(() => {
    게시판상세정보가져오기();
  }, []);

  /**
   * 게시글 상세정보를 가져와주세요
   */

  return (
    <div className="ui-wrap">
      <div className="ui-body-wrap">
        <h2>{article.title}</h2>
        <div className="ui-body">
          <p>{article.body}</p>
        </div>

        <h3>댓글</h3>

        <div className="ui-reply">
          <div>댓글이 없습니다</div>
        </div>

        <form className="ui-reply-form">
          <textarea></textarea>
          <button className="ui-blue-button">댓글쓰기</button>
        </form>
      </div>
    </div>
  );
}

function Main() {
  const navigation = useNavigate();
  const { loginUser } = React.useContext(StoreContext);
  const [article, setArticle] = React.useState([]);

  /**
   * 게시글(article)을 전부 가져와서
   * Main 페이지에 보여주세요
   * CSS는 어떻게 구현하셔도 상관은 없습니다 (최대한 깔끔하게~)
   * - useState => 가져온거 저장해야겠죠 state로
   * - useEffect => 게시글 가져와야겠죠 서버에서?
   */
  const 게시글정보가져와 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "GET",
    }).then((response) => {
      setArticle(response.data);
    });
  };

  React.useEffect(() => {
    게시글정보가져와();
  }, []);

  const 글등록페이지이동 = () => {
    navigation("/write");
  };

  return (
    <div className="ui-wrap">
      {/* <h2>{loginUser.nickname}님 안녕하세요!</h2> */}
      <button className="ui-green-button" onClick={글등록페이지이동}>
        글등록
      </button>
      <table className="ui-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {article.length > 0 &&
            article.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                  <td>{item.nickname}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 1. React Router DOM (완료)
 * npm install react-router-dom
 *
 * 2. Context Provider (완료)
 * 두개 설정해주세요
 * https://to2.kr/d6P
 */
const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
    }).then((res) => {
      setLoginUser(res.data);
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/write" element={<Write />} />
        <Route exact path="/article/:seq" element={<Article />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
