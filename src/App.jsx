import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
} from "lucide-react";
import "./index.css";

const NEGATIVE_GROUPS = [
  { key: "fear", title: "걱정 / 두려움", items: ["걱정되는", "암담한", "염려되는", "근심하는", "신경 쓰이는", "무서운", "겁나는", "두려운", "주눅 든"] },
  { key: "anxiety", title: "불안 / 긴장", items: ["불안한", "초조한", "긴장된", "조마조마한", "불편한"] },
  { key: "awkward", title: "곤란 / 어색함", items: ["난처한", "쑥스러운", "괴로운", "답답한", "갑갑한", "서먹한", "어색한", "찝찝한"] },
  { key: "sadness", title: "슬픔 / 상실", items: ["슬픈", "그리운", "우울한", "막막한", "서글픈", "서러운", "울적한", "참담한", "비참한", "속상한"] },
  { key: "lonely", title: "외로움", items: ["외로운", "고독한", "공허한", "쓸쓸한"] },
  { key: "fatigue", title: "무기력 / 피로", items: ["무력한", "무기력한", "침울한", "피곤한", "고된", "따분한", "지겨운", "절망스러운", "실망스러운", "좌절한", "힘든"] },
  { key: "boredom", title: "지루함", items: ["무료한", "지친", "심심한", "질린", "지루한"] },
  { key: "confused", title: "당황 / 혼란", items: ["혼란스러운", "놀란", "민망한", "당황한", "부끄러운"] },
  { key: "anger", title: "분노", items: ["화나는", "분한", "억울한", "짜증나는"] },
];

const NEED_GROUPS = [
  { key: "autonomy", title: "자율성", items: ["자신의 꿈·목표·가치를 선택할 자유", "목표를 이루는 방법을 스스로 선택할 자유"] },
  { key: "survival", title: "신체적 / 생존", items: ["공기", "음식", "물", "주거", "휴식", "수면", "안전", "신체적 접촉", "편안함", "운동"] },
  { key: "social", title: "사회적 / 정서", items: ["소통", "관계", "우정", "존중", "공감", "이해", "지지", "협력", "사랑", "관심", "소속감", "신뢰"] },
  { key: "play", title: "놀이 / 재미", items: ["즐거움", "재미", "유머", "웃음"] },
  { key: "meaning", title: "삶의 의미", items: ["기여", "도전", "발견", "보람", "의미", "희망", "열정"] },
  { key: "truth", title: "진실성", items: ["정직", "진실", "개성", "자기존중", "비전", "꿈"] },
  { key: "peace", title: "아름다움 / 평화", items: ["아름다움", "평화", "조화", "질서", "평온함"] },
  { key: "selfRealization", title: "자아구현", items: ["성취", "배움", "성장", "창조성", "자기표현", "자신감"] },
];

const POSITIVE_GROUPS = [
  { key: "gratitude", title: "감사 / 기쁨", items: ["고마운", "감사한", "기쁜", "반가운", "행복한", "편안함", "편안한", "홀가분한", "느긋한", "차분한", "평온한", "고요한"] },
  { key: "energy", title: "활력", items: ["활기찬", "신나는", "짜릿한", "기력이 넘치는", "힘이 솟는"] },
  { key: "hope", title: "희망 / 기대", items: ["희망에 찬", "기대에 부푼", "자신감 있는"] },
  { key: "warmth", title: "사랑 / 따뜻함", items: ["사랑하는", "친근한", "훈훈한", "따뜻한", "포근한"] },
  { key: "satisfaction", title: "만족 / 성취", items: ["뿌듯한", "만족스러운", "상쾌한", "개운한", "후련한", "든든한"] },
  { key: "moved", title: "감동", items: ["감동받은", "뭉클한", "감격스러운", "벅찬", "환희에 찬", "황홀한"] },
  { key: "interest", title: "흥미", items: ["흥미로운", "재미있는"] },
];

const RECORDS_KEY = "nawa-prayer-talk-records-v3";
const UI_KEY = "nawa-prayer-talk-ui-v3";
const THEME_KEY = "nawa-prayer-talk-theme-v3";

const THEMES = [
  { key: "cream", label: "🍦 크림" },
  { key: "sage", label: "🌿 세이지" },
  { key: "lavender", label: "🪻 라벤더" },
  { key: "peach", label: "🍑 피치" },
  { key: "night", label: "🌙 나이트" },
];

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const nowTimeString = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseYmd = (s) => {
  const [y, m, d] = (s || todayString()).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const entryId = () => `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emptyEntry = (date = todayString()) => ({
  id: entryId(),
  date,
  timeLabel: nowTimeString(),
  title: "",
  negative: [],
  reason: "",
  empathy: "",
  needs: [],
  needsOtherChecked: false,
  needsOtherText: "",
  message: "",
  selfMessage: "",
  canDo: "",
  cannotDo: "",
  prayer: "",
  positive: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const normalizeRecords = (raw) => {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  Object.entries(raw).forEach(([date, value]) => {
    if (Array.isArray(value)) {
      out[date] = value.map((entry) => ({ ...emptyEntry(date), ...entry, date, id: entry.id || entryId() }));
    } else if (value && typeof value === "object") {
      out[date] = [{ ...emptyEntry(date), ...value, date, id: value.id || entryId() }];
    } else {
      out[date] = [];
    }
  });
  return out;
};

const readRecords = () => {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeRecords(parsed);
  } catch {
    return {};
  }
};

const saveRecords = (records) => localStorage.setItem(RECORDS_KEY, JSON.stringify(records));

const readUi = () => {
  try {
    const raw = localStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUi = (ui) => localStorage.setItem(UI_KEY, JSON.stringify(ui));
const toggleInList = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

function appThemeClass(theme) {
  return `app-root theme-${theme}`;
}

function BaseButton({ children, className = "", type = "button", onClick }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
}

function BaseInput(props) {
  return <input {...props} className={`field ${props.className || ""}`} />;
}

function BaseTextarea(props) {
  return <textarea {...props} className={`field textarea ${props.className || ""}`} />;
}

function BaseCheckbox({ checked, onChange, id }) {
  return <input id={id} type="checkbox" checked={checked} onChange={onChange} className="checkbox" />;
}

function MonthCalendar({ records, currentDate, onSelectDate, monthCursor, setMonthCursor }) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const totalDays = last.getDate();
  const cells = [];

  for (let i = 0; i < startDay; i += 1) cells.push(null);
  for (let d = 1; d <= totalDays; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="card">
      <div className="card-head calendar-head">
        <div className="card-title">달력 기록</div>
        <div className="calendar-nav">
          <BaseButton className="icon-btn" onClick={() => setMonthCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft size={18} />
          </BaseButton>
          <div className="calendar-label">{year}년 {month + 1}월</div>
          <BaseButton className="icon-btn" onClick={() => setMonthCursor(new Date(year, month + 1, 1))}>
            <ChevronRight size={18} />
          </BaseButton>
        </div>
      </div>

      <div className="weekday-grid">
        {weekdays.map((w) => <div key={w} className="weekday">{w}</div>)}
      </div>

      <div className="calendar-grid">
        {cells.map((dateObj, idx) => {
          if (!dateObj) return <div key={`empty-${idx}`} className="calendar-empty" />;
          const dateKey = ymd(dateObj);
          const count = (records[dateKey] || []).length;
          const isSelected = dateKey === currentDate;
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`calendar-day ${isSelected ? "selected" : ""}`}
            >
              <span>{dateObj.getDate()}</span>
              <span className={`day-count ${count > 0 ? "visible" : ""}`}>{count}개</span>
            </button>
          );
        })}
      </div>

      <div className="helper-text">작성한 날은 개수로 표시돼. 날짜를 누르면 그날 기록을 볼 수 있어.</div>
    </div>
  );
}

function EntryList({ entries, selectedEntryId, onSelect, onCreate, onDelete, onCopy, onRename, currentDate }) {
  const [editingKey, setEditingKey] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    if (!entries.some((item, idx) => `${item.id}::${idx}` === editingKey)) {
      setEditingKey("");
      setEditingTitle("");
    }
  }, [entries, editingKey]);

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">{currentDate} 기록</div>
        <BaseButton className="primary-btn" onClick={onCreate}>
          <Plus size={16} />추가
        </BaseButton>
      </div>

      <div className="entry-list">
        {entries.length === 0 ? (
          <div className="helper-text">이 날짜에는 아직 기록이 없어.</div>
        ) : (
          entries.map((entry, idx) => {
            const itemKey = `${entry.id}::${idx}`;
            const isEditing = editingKey === itemKey;
            const isSelected = selectedEntryId === entry.id;

            return (
              <div key={`${entry.id}-${idx}`} className={`entry-item ${isSelected ? "active" : ""}`}>
                <div className="entry-main">
                  {isEditing ? (
                    <div className="entry-edit">
                      <BaseInput
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="row-btns">
                        <BaseButton
                          className="primary-btn small-btn"
                          onClick={() => {
                            onRename(entry, editingTitle, idx);
                            setEditingKey("");
                            setEditingTitle("");
                          }}
                        >
                          완료
                        </BaseButton>
                        <BaseButton
                          className="outline-btn small-btn"
                          onClick={() => {
                            setEditingKey("");
                            setEditingTitle("");
                          }}
                        >
                          취소
                        </BaseButton>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => onSelect(entry.id)} className="entry-select">
                      <div className="entry-title">{entry.title?.trim() || `${idx + 1}번째 기록`}</div>
                      <div className="entry-time">{entry.timeLabel || "시간 미지정"}</div>
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="entry-actions">
                    <BaseButton
                      className="outline-btn tiny-btn"
                      onClick={() => {
                        setEditingKey((prev) => (prev === itemKey ? "" : itemKey));
                        setEditingTitle(entry.title || "");
                      }}
                    >
                      <Pencil size={14} />
                    </BaseButton>
                    <BaseButton className="ghost-btn tiny-btn" onClick={() => onCopy(entry)}>복사</BaseButton>
                    <BaseButton className="ghost-btn tiny-btn danger" onClick={() => onDelete(entry.id)}>
                      <Trash2 size={16} />
                    </BaseButton>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, children, subtitle }) {
  return (
    <div className="card">
      <div className="card-head column">
        <div className="card-title">{title}</div>
        {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function CollapsibleGroup({ title, items, selected, onToggle, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="collapse">
      <button type="button" className="collapse-head" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="collapse-title">{title}</div>
          <div className="collapse-sub">{open ? "접기" : "눌러서 펼치기"}</div>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open ? (
        <div className="collapse-body">
          {items.map((item) => {
            const id = `${title}-${item}`;
            return (
              <label key={item} htmlFor={id} className="check-item">
                <BaseCheckbox id={id} checked={selected.includes(item)} onChange={() => onToggle(item)} />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "lavender");
  const [records, setRecords] = useState(() => readRecords());
  const [currentDate, setCurrentDate] = useState(() => readUi().currentDate || todayString());
  const [selectedEntryId, setSelectedEntryId] = useState(() => readUi().selectedEntryId || "");
  const [entry, setEntry] = useState(emptyEntry(todayString()));
  const [savedMessage, setSavedMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const copyMessageTimer = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [monthCursor, setMonthCursor] = useState(parseYmd(readUi().currentDate || todayString()));
  const saveTimer = useRef(null);

  const dayEntries = useMemo(() => records[currentDate] || [], [records, currentDate]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    saveUi({ currentDate, selectedEntryId });
    setMonthCursor(parseYmd(currentDate));
  }, [currentDate, selectedEntryId]);

  useEffect(() => {
    const entries = records[currentDate] || [];
    if (entries.length === 0) {
      const newEntry = emptyEntry(currentDate);
      setSelectedEntryId(newEntry.id);
      setEntry(newEntry);
      return;
    }
    const target = entries.find((e) => e.id === selectedEntryId) || entries[0];
    setSelectedEntryId(target.id);
    if (JSON.stringify(target) !== JSON.stringify(entry)) setEntry(target);
  }, [currentDate, records]);

  useEffect(() => {
    if (!selectedEntryId) return;

    const day = records[entry.date] || [];
    const prev = day.find((e) => e.id === selectedEntryId);
    if (prev && JSON.stringify(prev) === JSON.stringify(entry)) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setRecords((old) => {
        const currentDay = old[entry.date] || [];
        const exists = currentDay.some((e) => e.id === selectedEntryId);
        const nextDay = exists
          ? currentDay.map((e) => (e.id === selectedEntryId ? { ...entry, updatedAt: new Date().toISOString() } : e))
          : [...currentDay, { ...entry, updatedAt: new Date().toISOString() }];
        const next = { ...old, [entry.date]: nextDay };
        saveRecords(next);
        return next;
      });
      setSavedMessage("자동 저장됨");
      window.clearTimeout(window.__nawaPrayerSaveMessageTimer);
      window.__nawaPrayerSaveMessageTimer = window.setTimeout(() => setSavedMessage(""), 900);
    }, 900);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [entry, selectedEntryId, records]);

  const updateEntry = (patch) => setEntry((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));

  const createEntryForDate = (date = currentDate) => {
    const newEntry = emptyEntry(date);
    setCurrentDate(date);
    setSelectedEntryId(newEntry.id);
    setEntry(newEntry);
  };

  const deleteEntry = (id) => {
    const day = records[currentDate] || [];
    const nextDay = day.filter((e) => e.id !== id);
    const nextRecords = { ...records, [currentDate]: nextDay };
    setRecords(nextRecords);
    saveRecords(nextRecords);

    if (selectedEntryId === id) {
      if (nextDay[0]) {
        setSelectedEntryId(nextDay[0].id);
        setEntry(nextDay[0]);
      } else {
        const fresh = emptyEntry(currentDate);
        setSelectedEntryId(fresh.id);
        setEntry(fresh);
      }
    }
  };

  const handleCopyEntry = async (targetEntry) => {
  
    const text = `제목: ${targetEntry.title || ""}
날짜: ${targetEntry.date} ${targetEntry.timeLabel || ""}

무슨 일이 있었나:
${targetEntry.reason || ""}

공감:
${targetEntry.empathy || ""}

내가 하고 싶은 말:
${targetEntry.message || ""}

나에게 해주고 싶은 말:
${targetEntry.selfMessage || ""}

할 수 있는 것:
${targetEntry.canDo || ""}

할 수 없는 것:
${targetEntry.cannotDo || ""}

기도:
${targetEntry.prayer || ""}

지금 느끼는 감정:
${(targetEntry.positive || []).join(", ") || ""}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      if (copyMessageTimer.current) clearTimeout(copyMessageTimer.current);
      setCopyMessage("복사완료");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    } catch {
      if (copyMessageTimer.current) clearTimeout(copyMessageTimer.current);
      setCopyMessage("복사 실패");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    }
  };
  // 🔹 백업 다운로드
  const handleExportBackup = () => {
    try {
      const backupData = {
        records,
        currentDate,
        selectedEntryId,
        theme
      };

      const blob = new Blob(
        [JSON.stringify(backupData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "maeum-backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSavedMessage("백업 파일 저장됨");
      setTimeout(() => setSavedMessage(""), 1500);

    } catch {
      setSavedMessage("백업 실패");
      setTimeout(() => setSavedMessage(""), 1500);
    }
  };

  // 🔹 백업 복원
  const handleImportBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.records) throw new Error();

        setRecords(data.records);
        saveRecords(data.records);

        if (data.currentDate) setCurrentDate(data.currentDate);
        if (data.selectedEntryId) setSelectedEntryId(data.selectedEntryId);
        if (data.theme) setTheme(data.theme);

        setSavedMessage("백업 복원 완료");
        setTimeout(() => setSavedMessage(""), 1500);

      } catch {
        setSavedMessage("백업 파일 오류");
        setTimeout(() => setSavedMessage(""), 1500);
      }
    };

    reader.readAsText(file);
  };
  return (
    <div className={appThemeClass(theme)}>
      <div className="page-wrap">
        <div className="left-col">
          <div className="card hero-card">
            <div className="hero-title-row">
              <div className="hero-title">
                <Sparkles size={22} />
                <span>나와의 대화</span>
              </div>
            </div>
            <p className="hero-subtitle">링크 열면 바로 쓰는 감정 기록</p>
            <div className="hero-copy">
              <div>내 브라우저에만 저장됨</div>
              <div className="muted-line">기기가 바뀔 경우 연동 불가 </div>
            </div>

            {copyMessage ? (
              <div className="toast">{copyMessage}</div>
            ) : savedMessage ? (
              <div className="saved-text">{savedMessage}</div>
            ) : null}
          </div>

          <div className="card">
            <div className="card-title">테마</div>
            <div className="card-subtitle">원하는 분위기로 바꿔서 기록해봐.</div>

            <div className="theme-grid">
              {THEMES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTheme(item.key)}
                  className={`theme-chip ${theme === item.key ? "active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
<div className="card">
  <div className="card-title">백업</div>
  <div className="card-subtitle">폰을 바꾸기 전에 백업 파일을 저장해두면 복원할 수 있어.</div>

  <div className="row-btns" style={{ marginTop: 12, flexWrap: "wrap" }}>
    <BaseButton className="outline-btn" onClick={handleExportBackup}>
      백업 다운로드
    </BaseButton>

    <label className="outline-btn" style={{ cursor: "pointer" }}>
      백업 복원
      <input
        type="file"
        accept="application/json"
        onChange={handleImportBackup}
        style={{ display: "none" }}
      />
    </label>
  </div>
</div>
          <MonthCalendar
            records={records}
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            monthCursor={monthCursor}
            setMonthCursor={setMonthCursor}
          />

          <EntryList
            entries={dayEntries}
            selectedEntryId={selectedEntryId}
            onSelect={setSelectedEntryId}
            onCreate={() => createEntryForDate(currentDate)}
            onDelete={deleteEntry}
            onCopy={handleCopyEntry}
            onRename={(targetEntry, nextTitle, idx) => {
              setRecords((old) => {
                const day = old[targetEntry.date] || [];
                const nextDay = day.map((item, i) => {
                  if (i !== idx) return item;
                  return { ...item, title: nextTitle, updatedAt: new Date().toISOString() };
                });
                const next = { ...old, [targetEntry.date]: nextDay };
                saveRecords(next);
                return next;
              });
              if (selectedEntryId === targetEntry.id) {
                setEntry((prev) => ({ ...prev, title: nextTitle, updatedAt: new Date().toISOString() }));
              }
              setSavedMessage("제목을 수정했어");
              setTimeout(() => setSavedMessage(""), 1200);
            }}
            currentDate={currentDate}
          />
        </div>

        <div className="right-col">
          <SectionCard title="▶ 기록 제목" subtitle="한날에 여러 번 쓸 수 있어서 구분용 제목을 적어두면 좋아.">
            <BaseInput
              value={entry.title}
              onChange={(e) => updateEntry({ title: e.target.value })}
              placeholder="예: 오늘의 자기 대화"
            />
          </SectionCard>

          <SectionCard title="▶ 기분이 어때?" subtitle="감정표는 하나도 빠뜨리지 않고 모두 넣었어. 눌러서 펼치면 돼.">
            <div className="stack">
              {NEGATIVE_GROUPS.map((group, idx) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.negative}
                  onToggle={(item) => updateEntry({ negative: toggleInList(entry.negative, item) })}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="▶ 무엇 때문에?">
            <BaseTextarea value={entry.reason} onChange={(e) => updateEntry({ reason: e.target.value })} />
          </SectionCard>

          <SectionCard title="▶ 그래서 그런 감정이 들었구나" subtitle="그럴 수 있지, 이해돼.">
            <BaseTextarea value={entry.empathy} onChange={(e) => updateEntry({ empathy: e.target.value })} />
          </SectionCard>

          <SectionCard title="▶ 그럼 네가 그 상대(또는 자신)에게 바라는 것은 무엇이야?">
            <div className="stack">
              {NEED_GROUPS.map((group) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.needs}
                  onToggle={(item) => updateEntry({ needs: toggleInList(entry.needs, item) })}
                />
              ))}

              <div className="inner-box">
                <div className="inner-title">기타</div>
                <label className="inline-check">
                  <BaseCheckbox
                    checked={entry.needsOtherChecked}
                    onChange={() => updateEntry({ needsOtherChecked: !entry.needsOtherChecked })}
                  />
                  <span>기타 항목 사용</span>
                </label>
                <BaseInput
                  value={entry.needsOtherText}
                  onChange={(e) => updateEntry({ needsOtherText: e.target.value })}
                  placeholder="기타 내용을 적어줘"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="▶ 네가 상대에게 하고 싶은 말은 뭐야?">
            <BaseTextarea value={entry.message} onChange={(e) => updateEntry({ message: e.target.value })} />
          </SectionCard>

          <SectionCard
            title="▶ 너는 자신에게 어떤 말을 해주고 싶어?"
            subtitle="자신에게 공감, 지지, 격려, 응원, 칭찬, 사랑, 축복의 말을 해줘."
          >
            <BaseTextarea value={entry.selfMessage} onChange={(e) => updateEntry({ selfMessage: e.target.value })} />
          </SectionCard>

          <SectionCard
            title="▶ 네가 원하는 것을 이루기 위해 무엇을 할 수 있을까?"
            subtitle="내가 할 수 없는 일과 내가 할 수 있는 일을 구분하여 실천 가능한 것을 조금씩 실천해보자."
          >
            <div className="two-col">
              <div className="stack">
                <div className="label-text">할 수 없는 것</div>
                <BaseTextarea value={entry.cannotDo} onChange={(e) => updateEntry({ cannotDo: e.target.value })} />
              </div>
              <div className="stack">
                <div className="label-text">할 수 있는 것</div>
                <BaseTextarea value={entry.canDo} onChange={(e) => updateEntry({ canDo: e.target.value })} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="▶ 기도"
            subtitle="상대방은 하나님만 변화시킬 수 있으니 하나님께 맡기고 기도하며 기다리고, 자신의 변화와 성장을 위해 계획한 것을 실천하도록 도와달라고 기도하기"
          >
            <BaseTextarea
              value={entry.prayer || ""}
              onChange={(e) => updateEntry({ prayer: e.target.value })}
              placeholder="기도 내용을 적어줘"
            />
          </SectionCard>

          <SectionCard title="▶ 지금은 기분이 어때?">
            <div className="stack">
              {POSITIVE_GROUPS.map((group) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.positive}
                  onToggle={(item) => updateEntry({ positive: toggleInList(entry.positive, item) })}
                />
              ))}
            </div>
          </SectionCard>

          <div className="sticky-save">
            <BaseButton
              className={`save-btn ${isSaving ? "saving" : ""}`}
              onClick={() => {
                setIsSaving(true);
                const updatedEntry = { ...entry, updatedAt: new Date().toISOString() };
                setRecords((old) => {
                  const currentDay = old[updatedEntry.date] || [];
                  const exists = currentDay.some((e) => e.id === selectedEntryId);
                  const nextDay = exists
                    ? currentDay.map((e) => (e.id === selectedEntryId ? updatedEntry : e))
                    : [...currentDay, updatedEntry];
                  const next = { ...old, [updatedEntry.date]: nextDay };
                  saveRecords(next);
                  return next;
                });
                setSavedMessage("저장하였습니다");
                setTimeout(() => {
                  setSavedMessage("");
                  setIsSaving(false);
                }, 1200);
              }}
            >
              <Check size={16} />{isSaving ? "저장 중..." : "저장"}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
