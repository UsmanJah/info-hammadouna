import { useState, useEffect, useMemo } from "react";

/* ══════════════════════════════════════════
   Constants
══════════════════════════════════════════ */
const GREG_MONTHS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];
const GREG_MONTHS_SHORT = [
  "Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"
];
const DAYS_SHORT = ["D","L","M","M","J","V","S"];

/* ── Filtrage holidays ── */
const HIDDEN_PREFIXES = ["Martyrdom","Urs of","Urs off","Birth of","Birth Of"];
function shouldHide(h) {
  return HIDDEN_PREFIXES.some(p => h.toLowerCase().startsWith(p.toLowerCase()));
}
function filterHolidays(holidays = []) {
  return holidays.filter(h => !shouldHide(h));
}

/* ── Couleurs / emojis ── */
function eventColor(label) {
  const l = label.toLowerCase();
  if (l.includes("mawlid")||l.includes("nabi")||l.includes("prophet")) return "#16a34a";
  if (l.includes("ramadan")) return "#b45309";
  if (l.includes("laylat")||l.includes("qadr")) return "#b45309";
  if (l.includes("aïd")||l.includes("eid")||l.includes("fitr")||l.includes("adha")) return "#16a34a";
  if (l.includes("achoura")||l.includes("ashura")||l.includes("muharram")) return "#0d9488";
  if (l.includes("isra")||l.includes("mi'raj")) return "#7c3aed";
  if (l.includes("nouvel an")||l.includes("new year")||l.includes("hijri")) return "#16a34a";
  if (l.includes("arafa")) return "#0d9488";
  if (l.includes("sha'ban")||l.includes("shaban")) return "#0d9488";
  return "#16a34a";
}
function eventEmoji(label) {
  const l = label.toLowerCase();
  if (l.includes("mawlid")||l.includes("nabi")) return "💚";
  if (l.includes("ramadan")) return "🌙";
  if (l.includes("laylat")||l.includes("qadr")) return "⭐";
  if (l.includes("fitr")) return "🎊";
  if (l.includes("adha")) return "🐑";
  if (l.includes("achoura")||l.includes("ashura")) return "🤲";
  if (l.includes("isra")||l.includes("mi'raj")) return "✨";
  if (l.includes("nouvel an")||l.includes("new year")||l.includes("hijri")) return "🌙";
  if (l.includes("arafa")) return "🕌";
  if (l.includes("sha'ban")) return "📅";
  return "☪️";
}

function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

/* ══════════════════════════════════════════
   Responsive hook
══════════════════════════════════════════ */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isSm: w < 480, isMd: w >= 480 && w < 768, isLg: w >= 768, w };
}

/* ══════════════════════════════════════════
   API hook
══════════════════════════════════════════ */
function useHijriCalendar(year, month) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const mm = String(month + 1).padStart(2, "0");
    fetch(`https://www.api-dawahir.com/api/hijri-calendar?month=${mm}&year=${year}`, {
      headers: { accept: "application/json" },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [year, month]);

  return { data, loading, error };
}

/* ══════════════════════════════════════════
   SelectedDayCard
══════════════════════════════════════════ */
function SelectedDayCard({ selected, selEntry, selHolidays, month, year, isSm }) {
  if (!selected || !selEntry) {
    return (
      <div style={{ padding:"16px", textAlign:"center", color:"#94a3b8" }}>
        <div style={{ fontSize: isSm ? 20 : 24, marginBottom:6 }}>🗓️</div>
        <div style={{ fontSize:11 }}>Sélectionnez un jour</div>
      </div>
    );
  }
  return (
    <div className="fade-up">
      <div style={{
        padding: isSm ? "10px 12px" : "12px 14px 10px",
        background:"linear-gradient(135deg,#16a34a,#14532d)",
        display:"flex", alignItems:"center", gap:10,
      }}>
        <div style={{
          width: isSm ? 38 : 44, height: isSm ? 38 : 44,
          borderRadius:10, background:"rgba(255,255,255,.15)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Lora',serif", fontSize: isSm ? 18 : 22,
          fontWeight:700, color:"white", flexShrink:0,
        }}>
          {selected}
        </div>
        <div>
          <div style={{ fontSize: isSm ? 11 : 12, fontWeight:600, color:"white" }}>
            {GREG_MONTHS[month]} {year}
          </div>
          <div style={{ fontSize: isSm ? 10 : 11, color:"#86efac", marginTop:2 }}>
            {selEntry.hijri_date.split("-").slice(0,2).reverse().join(" ")} {selEntry.hijri_month} {selEntry.hijri_year}H
          </div>
          <div style={{ fontSize:10, color:"rgba(134,239,172,.7)", direction:"rtl", fontFamily:"serif" }}>
            {selEntry.hijri_month_ar}
          </div>
        </div>
      </div>
      <div style={{ padding: isSm ? "8px 10px" : "10px 12px" }}>
        {selHolidays.length > 0 ? (
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {selHolidays.map((h, i) => {
              const col = eventColor(h), em = eventEmoji(h);
              return (
                <div key={i} style={{
                  borderRadius:8, padding:"7px 9px",
                  display:"flex", alignItems:"center", gap:8,
                  background:`${col}10`, border:`1px solid ${col}25`,
                }}>
                  <span style={{ fontSize:14 }}>{em}</span>
                  <span style={{ fontSize: isSm ? 10 : 11, fontWeight:600, color:col, lineHeight:1.35 }}>{h}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"8px 0", color:"#94a3b8", fontSize:12 }}>
            Aucun événement
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   UpcomingPanel
══════════════════════════════════════════ */
function UpcomingPanel({ upcomingThisMonth, loading, month, setSelected, isSm, isGrid }) {
  return (
    <div style={{
      background:"white", borderRadius:14,
      border:"1px solid #bbf7d0",
      boxShadow:"0 2px 12px rgba(22,163,74,.07)",
      padding: isSm ? "10px 12px" : "12px",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <span style={{ fontSize:10 }}>🌙</span>
        <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", letterSpacing:1, textTransform:"uppercase" }}>
          Événements du mois
        </span>
      </div>
      {loading ? (
        <div style={{ color:"#86efac", fontSize:11, textAlign:"center", padding:"10px 0" }}>Chargement…</div>
      ) : upcomingThisMonth.length === 0 ? (
        <div style={{ color:"#94a3b8", fontSize:11, textAlign:"center", padding:"10px 0" }}>Aucun événement à venir</div>
      ) : (
        <div style={{
          display: isGrid ? "grid" : "flex",
          gridTemplateColumns: isGrid ? "repeat(auto-fill,minmax(190px,1fr))" : undefined,
          flexDirection: isGrid ? undefined : "column",
          gap: 6,
        }}>
          {upcomingThisMonth.map(({ day, entry, visible }, i) => {
            const label = visible[0];
            const col = eventColor(label), em = eventEmoji(label);
            const extra = visible.length - 1;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"7px 8px", borderRadius:9,
                background: i === 0 ? `${col}0d` : "#f8fafc",
                border:`1px solid ${i === 0 ? col+"25" : "#f1f5f9"}`,
                animation:`fadeUp .2s ease ${i*50}ms both`,
                cursor:"pointer",
              }} onClick={() => setSelected(day)}>
                <span style={{ fontSize:13, flexShrink:0 }}>{em}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {label}{extra > 0 && <span style={{ color:"#94a3b8", fontWeight:400 }}> +{extra}</span>}
                  </div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>
                    {day} {GREG_MONTHS_SHORT[month]} — {entry.hijri_date.split("-")[0]} {entry.hijri_month}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main component
══════════════════════════════════════════ */
export default function CalendrierIslamique() {
  const today = new Date();
  const [year, setYear]         = useState(today.getFullYear());
  const [month, setMonth]       = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());
  const [showHijri, setShowHijri] = useState(true);

  const { data, loading, error } = useHijriCalendar(year, month);
  const { isSm, isMd, isLg }    = useBreakpoint();

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const dayMap = useMemo(() => {
    if (!data?.calendar) return {};
    const map = {};
    data.calendar.forEach(entry => {
      const day = parseInt(entry.gregorian_date.split("-")[0], 10);
      map[day] = entry;
    });
    return map;
  }, [data]);

  const totalDays        = data?.total_days ?? 31;
  const firstDay         = getFirstDay(year, month);
  const selEntry         = selected ? dayMap[selected] : null;
  const selHolidays      = selEntry ? filterHolidays(selEntry.holidays) : [];
  const midEntry         = dayMap[15] || dayMap[1];
  const hijriHeaderLabel = midEntry ? `${midEntry.hijri_month} ${midEntry.hijri_year} H` : "";

  const upcomingThisMonth = useMemo(() => {
    const results = [];
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    Object.entries(dayMap).forEach(([dayStr, entry]) => {
      const day = parseInt(dayStr, 10);
      const visible = filterHolidays(entry.holidays);
      if (!visible.length) return;
      if (new Date(year, month, day) >= todayDate) results.push({ day, entry, visible });
    });
    return results.sort((a, b) => a.day - b.day).slice(0, 6);
  }, [dayMap, year, month]);

  return (
    <div style={{
      minHeight:"100vh",
      background:"#f0fdf4",
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"center",
      padding: isSm ? "12px 8px 32px" : "20px 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .day-btn {
          width:100%; aspect-ratio:1;
          border:none; background:transparent; border-radius:7px;
          cursor:pointer; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:1px; transition:background .12s; padding:2px;
          -webkit-tap-highlight-color:transparent;
        }
        .day-btn:hover:not(.empty):not(.today-cell) { background:rgba(22,163,74,.1); }
        .day-btn.today-cell  { background:#16a34a; }
        .day-btn.sel-cell:not(.today-cell) { background:#dcfce7; outline:2px solid #16a34a; outline-offset:-2px; }
        .day-btn.fri-cell .gnum { color:#16a34a; font-weight:700; }
        .day-btn.today-cell .gnum { color:white; }
        .day-btn.today-cell .hnum { color:rgba(255,255,255,.7); }

        .nav-btn {
          width:32px; height:32px; border-radius:8px;
          border:1px solid #bbf7d0; background:white;
          cursor:pointer; color:#16a34a; font-size:16px;
          display:flex; align-items:center; justify-content:center;
          transition:all .12s; flex-shrink:0;
          -webkit-tap-highlight-color:transparent;
        }
        .nav-btn:hover { background:#16a34a; color:white; border-color:#16a34a; }

        .pill {
          border-radius:6px; font-size:10px; font-weight:600;
          padding:3px 8px; cursor:pointer; border:1px solid transparent;
          transition:all .12s; white-space:nowrap;
          -webkit-tap-highlight-color:transparent;
        }
        .pill.on  { background:#16a34a; color:white; border-color:#16a34a; }
        .pill.off { background:white; color:#16a34a; border-color:#bbf7d0; }
        .pill.off:hover { background:#f0fdf4; }

        .dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation:fadeUp .25s ease both; }
      `}</style>

      <div style={{ width:"100%", maxWidth: isLg ? 800 : isMd ? 620 : "100%", display:"flex", flexDirection:"column", gap: isSm ? 14 : 20 }}>

        {/* ── TITLE ── */}
        <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease both" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:7,
            background:"#dcfce7", borderRadius:99,
            padding: isSm ? "5px 12px" : "6px 16px", marginBottom: isSm ? 10 : 14,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
            <span style={{ fontSize: isSm ? 10 : 12, fontWeight:700, color:"#15803d", letterSpacing:2, textTransform:"uppercase" }}>
              Agenda islamique {year}
            </span>
          </div>
          <h1 style={{
            fontFamily:"'Lora', serif",
            fontSize: isSm ? "clamp(28px,9vw,40px)" : "clamp(34px,6vw,58px)",
            fontWeight:700, color:"#0f172a", letterSpacing:-1, lineHeight:1.05, marginBottom: isSm ? 6 : 10,
          }}>
            Calendrier
          </h1>
          {!isSm && (
            <p style={{ fontSize:14, color:"#64748b", maxWidth:400, margin:"0 auto", lineHeight:1.7 }}>
              Calendrier grégorien & hijri avec toutes les dates importantes de l'Islam.
            </p>
          )}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginTop: isSm ? 10 : 16 }}>
            <div style={{ height:1, width:40, background:"linear-gradient(90deg,transparent,#22c55e)" }} />
            <span style={{ color:"#22c55e", fontSize:13 }}>✦</span>
            <div style={{ height:1, width:40, background:"linear-gradient(90deg,#22c55e,transparent)" }} />
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div style={{
          display: isLg ? "grid" : "flex",
          gridTemplateColumns: isLg ? "1fr 230px" : undefined,
          flexDirection: "column",
          gap: isSm ? 10 : 12,
          alignItems: "flex-start",
        }}>

          {/* ── Calendar card ── */}
          <div style={{
            background:"white", borderRadius:16,
            border:"1px solid #bbf7d0",
            boxShadow:"0 4px 24px rgba(22,163,74,.08)",
            overflow:"hidden",
          }}>
            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#166534 0%,#14532d 100%)", padding: isSm ? "11px 12px 9px" : "14px 16px 12px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, gap:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap: isSm ? 6 : 10, flex:1, minWidth:0 }}>
                  <button className="nav-btn" onClick={prev}>‹</button>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Lora',serif", fontSize: isSm ? 15 : 18, fontWeight:700, color:"white", lineHeight:1.1 }}>
                      {isSm ? GREG_MONTHS_SHORT[month] : GREG_MONTHS[month]} {year}
                    </div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,.55)", marginTop:1 }}>
                      {loading ? "…" : hijriHeaderLabel}
                    </div>
                  </div>
                  <button className="nav-btn" onClick={next}>›</button>
                </div>
                <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
                  <button className="pill"
                    style={{ background:"rgba(255,255,255,.15)", color:"rgba(255,255,255,.85)", borderColor:"rgba(255,255,255,.2)" }}
                    onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelected(today.getDate()); }}
                  >
                    {isSm ? "Auj." : "Aujourd'hui"}
                  </button>
                  <button
                    className={`pill ${showHijri ? "on" : "off"}`}
                    style={showHijri ? {} : { background:"rgba(255,255,255,.12)", color:"rgba(255,255,255,.7)", borderColor:"rgba(255,255,255,.2)" }}
                    onClick={() => setShowHijri(h => !h)}
                  >
                    Hijri
                  </button>
                </div>
              </div>
              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                {DAYS_SHORT.map((d, i) => (
                  <div key={i} style={{
                    textAlign:"center", fontSize: isSm ? 10 : 11, fontWeight:600,
                    color: i === 5 ? "#86efac" : "rgba(255,255,255,.4)",
                    letterSpacing:.3, paddingBottom:2,
                  }}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid body */}
            <div style={{ padding: isSm ? "7px 8px 10px" : "10px 12px 12px" }}>
              {loading && <div style={{ textAlign:"center", padding:"28px 0", color:"#86efac", fontSize:12 }}>Chargement…</div>}
              {error   && <div style={{ textAlign:"center", padding:"18px 0", color:"#f87171", fontSize:11 }}>Erreur : {error}</div>}

              {!loading && !error && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap: isSm ? 1 : 2 }}>
                  {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} className="day-btn empty" />)}
                  {Array.from({ length: totalDays }).map((_,i) => {
                    const day   = i + 1;
                    const entry = dayMap[day];
                    const isToday = day===today.getDate() && month===today.getMonth() && year===today.getFullYear();
                    const isSel   = day===selected && !isToday;
                    const dow     = (firstDay+i)%7;
                    const isFri   = dow===5;
                    const isSun   = dow===0;
                    const vis     = entry ? filterHolidays(entry.holidays) : [];
                    const hijriDay = entry ? parseInt(entry.hijri_date.split("-")[0], 10) : null;

                    return (
                      <button key={day}
                        className={`day-btn${isToday?" today-cell":""}${isSel?" sel-cell":""}${isFri?" fri-cell":""}`}
                        onClick={() => setSelected(day===selected ? null : day)}
                      >
                        <span className="gnum" style={{
                          fontSize: isSm ? 11 : 12, fontWeight:600, lineHeight:1,
                          color: isToday?"white" : isFri?"#16a34a" : isSun?"#94a3b8" : "#1e293b",
                        }}>
                          {day}
                        </span>
                        {showHijri && hijriDay && (
                          <span className="hnum" style={{
                            fontSize: isSm ? 7 : 8, fontWeight:500, lineHeight:1,
                            color: isToday?"rgba(255,255,255,.65)" : "#86efac",
                          }}>
                            {hijriDay}
                          </span>
                        )}
                        {vis.length > 0 && (
                          <div style={{ display:"flex", gap:2, justifyContent:"center", marginTop:1 }}>
                            {vis.slice(0,2).map((_h,ei) => (
                              <span key={ei} className="dot"
                                style={{ background: isToday?"rgba(255,255,255,.8)":eventColor(_h) }} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Legend */}
              <div style={{
                display:"flex", gap: isSm ? 8 : 12, marginTop:10, paddingTop:10,
                borderTop:"1px solid #f0fdf4", flexWrap:"wrap",
              }}>
                {[
                  { color:"#16a34a", label:"Fête islamique" },
                  { color:"#0d9488", label:"Commémoration" },
                  { color:"#7c3aed", label:"Nuit sacrée" },
                  { color:"#b45309", label:"Ramadan / Qadr" },
                ].map(x => (
                  <div key={x.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span className="dot" style={{ width:6, height:6, background:x.color }} />
                    <span style={{ fontSize: isSm ? 9 : 10, color:"#64748b" }}>{x.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected day — inline on mobile/tablet */}
            {!isLg && (
              <div style={{ margin:"0 10px 10px", borderRadius:12, overflow:"hidden", border:"1px solid #bbf7d0" }}>
                <SelectedDayCard
                  selected={selected} selEntry={selEntry}
                  selHolidays={selHolidays} month={month} year={year} isSm={isSm}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar — desktop only ── */}
          {isLg && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:"white", borderRadius:14, border:"1px solid #bbf7d0", boxShadow:"0 2px 12px rgba(22,163,74,.07)", overflow:"hidden" }}>
                <SelectedDayCard
                  selected={selected} selEntry={selEntry}
                  selHolidays={selHolidays} month={month} year={year} isSm={false}
                />
              </div>
              <UpcomingPanel
                upcomingThisMonth={upcomingThisMonth} loading={loading}
                month={month} setSelected={setSelected} isSm={false} isGrid={false}
              />
            </div>
          )}
        </div>

        {/* ── Upcoming — below calendar on mobile/tablet ── */}
        {!isLg && (
          <UpcomingPanel
            upcomingThisMonth={upcomingThisMonth} loading={loading}
            month={month} setSelected={setSelected} isSm={isSm} isGrid={isMd}
          />
        )}

      </div>
    </div>
  );
}