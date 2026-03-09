import { useState } from "react";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("lavender");

  const themeClass = {
    cream: "theme-cream",
    sage: "theme-sage",
    lavender: "theme-lavender",
    peach: "theme-peach",
    night: "theme-night",
  }[theme];

  return (
    <div className={`app ${themeClass}`}>
      <div className="container">
        <section className="card hero">
          <h1>✨ 자기 대화와 기도</h1>
          <p className="subtitle">링크 열면 바로 쓰는 기록 앱</p>
          <p className="small">내 브라우저에만 저장됨</p>
          <p className="small">친구와 링크는 같이 써도, 기록은 각자 자기 기기 안에만 저장돼.</p>
        </section>

        <section className="card">
          <h2>테마</h2>
          <p className="small">원하는 분위기로 바꿔서 기록해봐.</p>
          <div className="theme-grid">
            <button onClick={() => setTheme("cream")}>🍦 크림</button>
            <button onClick={() => setTheme("sage")}>🌿 세이지</button>
            <button onClick={() => setTheme("lavender")}>🪻 라벤더</button>
            <button onClick={() => setTheme("peach")}>🍑 피치</button>
            <button onClick={() => setTheme("night")}>🌙 나이트</button>
          </div>
        </section>

        <section className="card">
          <h2>▶ 기록 제목</h2>
          <input type="text" placeholder="예: 오늘의 자기 대화" />
        </section>

        <section className="card">
          <h2>▶ 기분이 어때?</h2>
          <textarea placeholder="지금 느끼는 감정을 적어봐" />
        </section>

        <section className="card">
          <h2>▶ 무엇 때문에?</h2>
          <textarea />
        </section>

        <section className="card">
          <h2>▶ 그래서 그런 감정이 들었구나</h2>
          <textarea />
        </section>

        <section className="card">
          <h2>▶ 그럼 네가 그 상대(또는 자신)에게 바라는 것은 무엇이야?</h2>
          <textarea placeholder="바라는 것을 적어줘" />
        </section>

        <section className="card">
          <h2>▶ 네가 상대에게 하고 싶은 말은 뭐야?</h2>
          <textarea />
        </section>

        <section className="card">
          <h2>▶ 너는 자신에게 어떤 말을 해주고 싶어?</h2>
          <textarea />
        </section>

        <section className="card">
          <h2>▶ 네가 원하는 것을 이루기 위해 무엇을 할 수 있을까?</h2>
          <div className="two-col">
            <div>
              <label>내가 할 수 없는 일</label>
              <textarea />
            </div>
            <div>
              <label>내가 할 수 있는 일</label>
              <textarea />
            </div>
          </div>
        </section>

        <section className="card">
          <h2>▶ 기도</h2>
          <p className="small">
            상대방은 하나님만 변화시킬 수 있으니 하나님께 맡기고 기도하며 기다리고,
            자신의 변화와 성장을 위해 계획한 것을 실천하도록 도와달라고 기도하기
          </p>
          <textarea placeholder="기도 내용을 적어줘" />
        </section>

        <section className="card">
          <h2>▶ 지금은 기분이 어때?</h2>
          <textarea />
        </section>

        <button className="save-btn">저장</button>
      </div>
    </div>
  );
}
