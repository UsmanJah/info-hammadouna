import { useState, useEffect, useMemo } from "react";
import { useApi } from "../hooks/useApi";  // ← seul changement d'import

/* ══════════════════════════════════════════════════════
   PALETTE MARQUE
══════════════════════════════════════════════════════ */
const BRAND = {
  greenDark:  "#0c6938",
  greenMid:   "#13894f",
  greenLight: "#00bf63",
  white:      "#f9fbfd",
  goldDark:   "#caa127",
  goldMid:    "#dcb626",
  goldLight:  "#e8be21",
};

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
const MONTHS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function parseParts(str) {
  if (!str || typeof str !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [y, m, d] = str.split("T")[0].split("-");
    return { day: d, monthIdx: Number(m) - 1, year: y };
  }
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length >= 3) {
      const [d, m, y] = parts;
      return { day: d.padStart(2, "0"), monthIdx: Number(m) - 1, year: y };
    }
  }
  return null;
}
function parseDate(str) {
  const p = parseParts(str);
  if (!p) return new Date(0);
  return new Date(Number(p.year), p.monthIdx, Number(p.day));
}
function formatDateFull(str) {
  const p = parseParts(str);
  if (!p) return str || "—";
  return `${p.day} ${MONTHS_FULL[p.monthIdx] ?? "???"} ${p.year}`;
}
function getDayMonth(str) {
  const p = parseParts(str);
  if (!p) return { day: "??", month: "???" };
  return { day: p.day, month: MONTHS[p.monthIdx] ?? "???" };
}
function daysUntil(str) {
  const d = parseDate(str);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

const CAT = {
  Gamou:      { bg: "#dcfce7", text: "#14532d", dot: "#13894f" },
  Magal:      { bg: "#fef9c3", text: "#713f12", dot: "#dcb626" },
  Ziarra:     { bg: "#f3e8ff", text: "#581c87", dot: "#9333ea" },
  Conférence: { bg: "#dbeafe", text: "#1e3a8a", dot: "#2563eb" },
  Formation:  { bg: "#cffafe", text: "#164e63", dot: "#0891b2" },
  Séminaire:  { bg: "#ffe4e6", text: "#881337", dot: "#e11d48" },
  Communauté: { bg: "#ecfce7", text: "#0c6938", dot: "#00bf63" },
  Atelier:    { bg: "#fef3c7", text: "#92400e", dot: "#caa127" },
  Prière:     { bg: "#e0e7ff", text: "#3730a3", dot: "#6366f1" },
  Collecte:   { bg: "#fce7f3", text: "#831843", dot: "#ec4899" },
  Jeunesse:   { bg: "#f0fdf4", text: "#166534", dot: "#00bf63" },
};
const DEFAULT_CAT = { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" };
const getC = (cat) => CAT[cat] || DEFAULT_CAT;

const IcoCal    = ({ c=BRAND.greenMid }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoClock  = ({ c=BRAND.greenMid }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoPin    = ({ c=BRAND.greenMid }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoArrow  = ({ c="white"        }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoClose  = ({ c="currentColor" }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoCalBig = ({ c="white" })        => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoStar   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill={BRAND.goldMid} stroke={BRAND.goldMid} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

function Badge({ category, light = false }) {
  const c = getC(category);
  if (light) {
    return (
      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99, background:"rgba(255,255,255,0.18)", color:"#fff", fontSize:11, fontWeight:700, backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,0.3)" }}>
        <span style={{ width:5, height:5, borderRadius:"50%", background:BRAND.goldLight, flexShrink:0 }} />
        {category}
      </span>
    );
  }
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99, background:c.bg, color:c.text, fontSize:11, fontWeight:700 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {category}
    </span>
  );
}

function HeroEventCard({ event, onClick }) {
  const [hov, setHov] = useState(false);
  const { day, month } = getDayMonth(event.date);
  const delta = daysUntil(event.date);
  const label = delta === 0 ? "Aujourd'hui !" : delta === 1 ? "Demain" : `Dans ${delta} jours`;

  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 22, overflow: "hidden", cursor: "pointer", position: "relative",
        background: `linear-gradient(135deg, ${BRAND.greenDark} 0%, ${BRAND.greenMid} 55%, ${BRAND.greenLight} 100%)`,
        boxShadow: hov ? `0 24px 56px rgba(12,105,56,0.45), 0 0 0 3px ${BRAND.goldMid}88` : `0 12px 40px rgba(12,105,56,0.3), 0 0 0 2px ${BRAND.goldMid}44`,
        transform: hov ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
        animation: "fadeUp 0.5s ease both", marginBottom: 12,
      }}
    >
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ position:"absolute", bottom:-60, right:60, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ position:"absolute", top:20, right:30, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${BRAND.goldMid},${BRAND.goldLight},${BRAND.goldMid},transparent)` }}/>
      </div>
      <div style={{ padding:"28px 28px 24px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`linear-gradient(90deg,${BRAND.goldDark},${BRAND.goldMid})`, borderRadius:99, padding:"5px 14px" }}>
            <IcoStar/>
            <span style={{ fontSize:11, fontWeight:800, color:"#fff", letterSpacing:1.5, textTransform:"uppercase" }}>Prochain évènement</span>
          </div>
          <Badge category={event.category} light />
        </div>
        <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:18, background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:`2px solid ${BRAND.goldMid}66`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#fff" }}>
              <span style={{ fontSize:26, fontWeight:900, lineHeight:1, fontFamily:"'Cormorant Garamond',serif" }}>{day}</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:1, opacity:0.85 }}>{String(month).toUpperCase()}</span>
            </div>
            <div style={{ marginTop:8, background:`linear-gradient(90deg,${BRAND.goldDark},${BRAND.goldMid})`, borderRadius:99, padding:"2px 10px", display:"inline-block" }}>
              <span style={{ fontSize:10, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>{label}</span>
            </div>
          </div>
          <div style={{ flexGrow:1, minWidth:0 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3vw,26px)", fontWeight:700, color:"#fff", lineHeight:1.25, marginBottom:10 }}>{event.title}</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.8)" }}><IcoClock c="rgba(255,255,255,0.7)"/>{event.heure}</span>
              <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.8)" }}><IcoPin c="rgba(255,255,255,0.7)"/>{event.lieu}</span>
            </div>
          </div>
          <div style={{ flexShrink:0 }}>
            <button style={{ background: hov ? `linear-gradient(135deg,${BRAND.goldLight},${BRAND.goldDark})` : `linear-gradient(135deg,${BRAND.goldMid},${BRAND.goldDark})`, color:BRAND.greenDark, border:"none", borderRadius:12, padding:"12px 22px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", gap:8, transition:"all 0.2s", whiteSpace:"nowrap", boxShadow:`0 6px 20px ${BRAND.goldDark}66`, letterSpacing:0.3 }}>
              Voir l'évènement <IcoArrow c={BRAND.greenDark}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const { day, month } = getDayMonth(event.date);
  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:18, background:BRAND.white, borderRadius:14, padding:"16px 20px", cursor:"pointer", border:`1.5px solid ${hov ? BRAND.greenLight + "66" : "#edf2ef"}`, boxShadow: hov ? `0 10px 28px rgba(12,105,56,0.1)` : "0 2px 8px rgba(0,0,0,0.04)", transform: hov ? "translateX(4px)" : "translateX(0)", transition:"all 0.25s cubic-bezier(0.34,1.4,0.64,1)", animation:`fadeUp 0.45s ease ${delay}s both`, position:"relative", overflow:"hidden" }}
    >
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background: hov ? BRAND.greenLight : BRAND.greenMid, borderRadius:"3px 0 0 3px", transition:"background 0.2s" }} />
      <div style={{ flexShrink:0, width:48, height:48, borderRadius:12, background:`linear-gradient(145deg,${BRAND.greenMid},${BRAND.greenDark})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:`0 4px 12px rgba(19,137,79,0.35)` }}>
        <span style={{ fontSize:17, fontWeight:800, lineHeight:1, fontFamily:"'Cormorant Garamond',serif" }}>{day}</span>
        <span style={{ fontSize:8, fontWeight:700, letterSpacing:0.5, opacity:0.85 }}>{String(month).toUpperCase()}</span>
      </div>
      <div style={{ flexGrow:1, minWidth:0 }}>
        <div style={{ marginBottom:4 }}><Badge category={event.category} /></div>
        <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", fontFamily:"'Cormorant Garamond',serif", marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{event.title}</div>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8" }}><IcoClock c="#94a3b8"/>{event.heure}</span>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8", overflow:"hidden" }}><IcoPin c="#94a3b8"/><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{event.lieu}</span></span>
        </div>
      </div>
      <div style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background: hov ? BRAND.greenLight : "#f0faf4", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>
        <IcoArrow c={hov ? "#fff" : BRAND.greenMid} />
      </div>
    </div>
  );
}

function DetailModal({ event, onClose }) {
  const c = getC(event.category);
  const delta = daysUntil(event.date);
  const isNext = delta >= 0;
  return (
    <div style={{ background:"#fff", borderRadius:24, maxWidth:500, width:"100%", position:"relative", overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.22)", animation:"scaleIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both" }} onClick={e => e.stopPropagation()}>
      <div style={{ background: isNext ? `linear-gradient(135deg,${BRAND.greenDark},${BRAND.greenMid})` : `linear-gradient(135deg,${c.dot}22,${c.dot}08)`, borderBottom: isNext ? "none" : `1.5px solid ${c.dot}25`, padding:"28px 28px 24px", position:"relative" }}>
        {isNext && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${BRAND.goldMid},${BRAND.goldLight},${BRAND.goldMid},transparent)` }}/>}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background: isNext ? "rgba(255,255,255,0.15)" : "#fff", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", color: isNext ? "#fff" : "#64748b", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <IcoClose c={isNext ? "#fff" : "#64748b"}/>
        </button>
        {delta >= 0 && (
          <div style={{ marginBottom:10 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:`linear-gradient(90deg,${BRAND.goldDark},${BRAND.goldMid})`, borderRadius:99, padding:"3px 12px" }}>
              <IcoStar/>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{delta === 0 ? "Aujourd'hui !" : delta === 1 ? "Demain" : `Dans ${delta} jours`}</span>
            </span>
          </div>
        )}
        <div style={{ marginBottom:10 }}><Badge category={event.category} light={isNext} /></div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color: isNext ? "#fff" : "#0f172a", lineHeight:1.3, paddingRight:32 }}>{event.title}</h2>
      </div>
      <div style={{ padding:"22px 28px 26px" }}>
        <p style={{ fontSize:14, color:"#64748b", lineHeight:1.8, marginBottom:22 }}>{event.description}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
          {[
            { ico:<IcoCal c={BRAND.greenMid}/>,  label:"Date",  val:formatDateFull(event.date) },
            { ico:<IcoClock c={BRAND.greenMid}/>, label:"Heure", val:event.heure },
            { ico:<IcoPin c={BRAND.greenMid}/>,   label:"Lieu",  val:event.lieu, span:true },
          ].map(x => (
            <div key={x.label} style={{ background:BRAND.white, borderRadius:12, padding:"12px 14px", borderLeft:`3px solid ${BRAND.greenMid}`, gridColumn: x.span ? "span 2" : "span 1" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3, color:"#94a3b8", fontSize:10, textTransform:"uppercase", letterSpacing:1, fontWeight:700 }}>{x.ico}{x.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{x.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PanelRow({ event, onClick, delay }) {
  const [hov, setHov] = useState(false);
  const { day, month } = getDayMonth(event.date);
  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background: hov ? "#f0faf4" : BRAND.white, borderRadius:13, border:`1.5px solid ${hov ? BRAND.greenLight + "66" : "#edf2ef"}`, cursor:"pointer", transition:"all 0.2s ease", animation:`fadeUp 0.3s ease ${Math.min(delay,0.4)}s both`, position:"relative", overflow:"hidden" }}
    >
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background: hov ? BRAND.greenLight : "transparent", transition:"background 0.2s", borderRadius:"3px 0 0 3px" }} />
      <div style={{ flexShrink:0, width:46, height:46, borderRadius:11, background:`linear-gradient(145deg,${BRAND.greenMid},${BRAND.greenDark})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#fff" }}>
        <span style={{ fontSize:17, fontWeight:800, lineHeight:1, fontFamily:"'Cormorant Garamond',serif" }}>{day}</span>
        <span style={{ fontSize:8, fontWeight:700, letterSpacing:0.5, opacity:0.85 }}>{String(month).slice(0,3).toUpperCase()}</span>
      </div>
      <div style={{ flexGrow:1, minWidth:0 }}>
        <div style={{ marginBottom:4 }}><Badge category={event.category} /></div>
        <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:3 }}>{event.title}</div>
        <div style={{ display:"flex", gap:12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8" }}><IcoClock c="#94a3b8"/>{event.heure}</span>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8", overflow:"hidden" }}><IcoPin c="#94a3b8"/><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{event.lieu}</span></span>
        </div>
      </div>
      <div style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background: hov ? BRAND.greenLight : "#f0faf4", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>
        <IcoArrow c={hov ? "#fff" : BRAND.greenMid} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════ */
export default function Event() {
  const [detail,     setDetail]     = useState(null);
  const [showPanel,  setShowPanel]  = useState(false);
  const [filterCat,  setFilterCat]  = useState("Tous");
  const [filterYear, setFilterYear] = useState("Tous");

  // ─── Seul changement : useApi remplace eventsData ───────────────────
  const { data, loading, error } = useApi("/evenements");
  const allEvents = data ?? [];
  // ────────────────────────────────────────────────────────────────────

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const sorted = useMemo(() =>
    [...allEvents].sort((a, b) => parseDate(a.date) - parseDate(b.date)),
  [allEvents]);

  const nextEvent = useMemo(() =>
    sorted.find(e => parseDate(e.date) >= today) || null,
  [sorted, today]);

  const upcomingRest = useMemo(() => {
    const future = sorted.filter(e => parseDate(e.date) >= today);
    return future.slice(1, 5);
  }, [sorted, today]);

  const years      = useMemo(() => [...new Set(sorted.map(e => e.annee).filter(Boolean))].sort(), [sorted]);
  const categories = useMemo(() => [...new Set(sorted.map(e => e.category).filter(Boolean))].sort(), [sorted]);

  const panelEvents = useMemo(() =>
    sorted.filter(e => {
      const okYear = filterYear === "Tous" || String(e.annee) === String(filterYear);
      const okCat  = filterCat  === "Tous" || e.category === filterCat;
      return okYear && okCat;
    }),
  [sorted, filterYear, filterCat]);

  useEffect(() => {
    document.body.style.overflow = (showPanel || detail) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showPanel, detail]);

  return (
    <div style={{ minHeight:"100vh", background:BRAND.white, fontFamily:"'Outfit',sans-serif", position:"relative" }}>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-200, right:-200, width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${BRAND.greenLight}0f,transparent 65%)` }}/>
        <div style={{ position:"absolute", bottom:-150, left:-150, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${BRAND.greenMid}0a,transparent 65%)` }}/>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"60px 24px 80px", position:"relative", zIndex:1 }}>

        {/* EN-TÊTE */}
        <div style={{ marginBottom:36, animation:"fadeUp 0.5s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:`${BRAND.greenDark}18`, borderRadius:99, padding:"5px 14px", marginBottom:16, border:`1px solid ${BRAND.greenMid}33` }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:BRAND.greenLight }}/>
            <span style={{ fontSize:11, fontWeight:700, color:BRAND.greenDark, letterSpacing:2, textTransform:"uppercase" }}>Agenda islamique</span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,50px)", fontWeight:700, color:BRAND.greenDark, lineHeight:1.1, marginBottom:6 }}>Évènements à venir</h1>
              <p style={{ fontSize:13, color:"#6b8f76", lineHeight:1.6 }}>Prochains rassemblements de la communauté</p>
            </div>
            <button onClick={() => setShowPanel(true)} onMouseEnter={e => e.currentTarget.style.background=BRAND.greenDark} onMouseLeave={e => e.currentTarget.style.background=BRAND.greenMid}
              style={{ background:BRAND.greenMid, color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", gap:8, transition:"background 0.2s", whiteSpace:"nowrap", boxShadow:`0 4px 16px rgba(19,137,79,0.35)` }}>
              <IcoCalBig/> Voir tout l'agenda
            </button>
          </div>
          <div style={{ marginTop:20, height:1, background:`linear-gradient(90deg,${BRAND.greenLight}55,transparent)` }}/>
        </div>

        {/* États chargement / erreur */}
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#94a3b8", fontSize:14 }}>
            Chargement des évènements…
          </div>
        )}
        {error && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#e11d48", fontSize:14 }}>
            Erreur : {error}
          </div>
        )}

        {/* HERO */}
        {!loading && !error && nextEvent && <HeroEventCard event={nextEvent} onClick={setDetail} />}

        {/* 4 SUIVANTS */}
        {!loading && !error && upcomingRest.length > 0 && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, marginTop:4 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase" }}>À venir</span>
              <div style={{ flexGrow:1, height:1, background:"#edf2ef" }}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {upcomingRest.map((ev, i) => <EventCard key={ev.id} event={ev} onClick={setDetail} delay={i * 0.07} />)}
            </div>
          </>
        )}

        {!loading && !error && sorted.length > 5 && (
          <div style={{ textAlign:"center", marginTop:28, animation:"fadeUp 0.5s ease 0.4s both" }}>
            <button onClick={() => setShowPanel(true)} style={{ background:"none", border:"none", color:BRAND.greenMid, fontSize:13, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, opacity:0.8, fontFamily:"'Outfit',sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.8"}>
              Voir les tous évènements <IcoArrow c={BRAND.greenMid}/>
            </button>
          </div>
        )}
      </div>

      {/* PANNEAU LATÉRAL */}
      {showPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", justifyContent:"flex-end", animation:"fadeIn 0.2s ease" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(12,60,30,0.45)", backdropFilter:"blur(5px)" }} onClick={() => setShowPanel(false)}/>
          <div style={{ position:"relative", width:"min(780px,100vw)", height:"100vh", background:BRAND.white, display:"flex", flexDirection:"column", animation:"slideIn 0.32s cubic-bezier(0.34,1.1,0.64,1) both", boxShadow:"-16px 0 48px rgba(0,0,0,0.15)" }}>
            <div style={{ background:"#fff", borderBottom:"1px solid #e4ede7", padding:"20px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${BRAND.greenLight},${BRAND.greenDark})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 12px rgba(12,105,56,0.35)` }}><IcoCalBig/></div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:BRAND.greenMid, letterSpacing:2, textTransform:"uppercase", marginBottom:1 }}>Agenda complet</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:BRAND.greenDark }}>Tous les évènements</div>
                </div>
              </div>
              <button onClick={() => setShowPanel(false)} onMouseEnter={e => e.currentTarget.style.background="#fee2e2"} onMouseLeave={e => e.currentTarget.style.background="#f1f5f9"}
                style={{ background:"#f1f5f9", border:"none", borderRadius:9, width:34, height:34, cursor:"pointer", color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }}>
                <IcoClose/>
              </button>
            </div>

            <div style={{ background:"#fff", borderBottom:"1px solid #e4ede7", padding:"14px 26px", flexShrink:0 }}>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Année</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {["Tous", ...years.map(String)].map(y => {
                    const active = String(filterYear) === y;
                    return <button key={y} onClick={() => setFilterYear(y)} style={{ padding:"5px 14px", borderRadius:99, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.15s", border: active ? "none" : `1.5px solid #dde8e0`, background: active ? BRAND.greenMid : "#fff", color: active ? "#fff" : "#4a7a5a" }}>{y}</button>;
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Catégorie</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {["Tous", ...categories].map(cat => {
                    const active = filterCat === cat;
                    const cc = cat !== "Tous" ? getC(cat) : null;
                    return <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding:"5px 14px", borderRadius:99, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.15s", border: active ? "none" : `1.5px solid #dde8e0`, background: active ? (cc ? cc.dot : BRAND.greenMid) : "#fff", color: active ? "#fff" : "#4a7a5a" }}>{cat}</button>;
                  })}
                </div>
              </div>
            </div>

            <div style={{ padding:"10px 26px 4px", fontSize:11, color:"#94a3b8", fontWeight:600, flexShrink:0 }}>
              {panelEvents.length} évènement{panelEvents.length > 1 ? "s" : ""}
            </div>

            <div style={{ overflowY:"auto", padding:"8px 26px 32px", flexGrow:1 }}>
              {panelEvents.length === 0 ? (
                <div style={{ textAlign:"center", padding:"70px 0", color:"#cbd5e1" }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>🌿</div>
                  <div style={{ fontSize:15, fontWeight:600 }}>Aucun résultat</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {panelEvents.map((ev, i) => <PanelRow key={ev.id} event={ev} onClick={e => { setDetail(e); setShowPanel(false); }} delay={i * 0.02} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE DÉTAIL */}
      {detail && (
        <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20, animation:"fadeIn 0.18s ease" }} onClick={() => setDetail(null)}>
          <div style={{ position:"absolute", inset:0, background:"rgba(12,40,20,0.55)", backdropFilter:"blur(8px)" }}/>
          <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:500 }}>
            <DetailModal event={detail} onClose={() => setDetail(null)} />
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateX(50px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-track { background:#f0faf4 }
        ::-webkit-scrollbar-thumb { background:${BRAND.greenLight}88; border-radius:4px }
      `}</style>
    </div>
  );
}