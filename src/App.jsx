import { useState } from "react";
import "./index.css";

export default function App() {

  const [theme,setTheme]=useState("lavender")

  const themes={
    cream:"theme-cream",
    sage:"theme-sage",
    lavender:"theme-lavender",
    peach:"theme-peach",
    night:"theme-night"
  }

  return (
    <div className={`app ${themes[theme]}`}>

      <div className="container">

        <div className="card hero">

          <h1>✨ 나와의 대화</h1>

          <p>링크 열면 바로 쓰는 감정 기록</p>

          <p className="small">내 브라우저에만 저장됨</p>

          <p className="small">
            친구와 링크는 같이 써도, 기록은 각자 자기 기기 안에만 저장돼.
          </p>

        </div>


        <div className="card">

          <h2>테마</h2>

          <div className="themes">

            <button onClick={()=>setTheme("cream")}>🍦 크림</button>

            <button onClick={()=>setTheme("sage")}>🌿 세이지</button>

            <button onClick={()=>setTheme("lavender")}>🪻 라벤더</button>

            <button onClick={()=>setTheme("peach")}>🍑 피치</button>

            <button onClick={()=>setTheme("night")}>🌙 나이트</button>

          </div>

        </div>


        <div className="card">

          <h2>▶ 기록 제목</h2>

          <input placeholder="예: 오늘의 자기 대화" />

        </div>


        <div className="card">

          <h2>▶ 기분이 어때?</h2>

          <textarea placeholder="지금 느끼는 감정을 적어봐"></textarea>

        </div>


        <div className="card">

          <h2>▶ 무엇 때문에?</h2>

          <textarea></textarea>

        </div>


        <div className="card">

          <h2>▶ 그래서 그런 감정이 들었구나</h2>

          <textarea></textarea>

        </div>


        <div className="card">

          <h2>▶ 네가 상대에게 하고 싶은 말은?</h2>

          <textarea></textarea>

        </div>


        <div className="card">

          <h2>▶ 너는 자신에게 어떤 말을 해주고 싶어?</h2>

          <textarea></textarea>

        </div>


        <div className="card">

          <h2>▶ 네가 원하는 것을 이루기 위해 무엇을 할 수 있을까?</h2>

          <textarea placeholder="내가 할 수 있는 것"></textarea>

          <textarea placeholder="내가 할 수 없는 것"></textarea>

        </div>


        <div className="card">

          <h2>▶ 기도</h2>

          <textarea placeholder="하나님께 맡기고 기도"></textarea>

        </div>


        <div className="card">

          <h2>▶ 지금은 기분이 어때?</h2>

          <textarea></textarea>

        </div>

      </div>

    </div>
  )
}
