import { useState } from "react";
import preches from "../data/preche.json";

/* ══════════════════════════════════════
   Islamic geometry SVGs (design system)
══════════════════════════════════════ */
function IslamicStar({ size = 60, color = "#22c55e", opacity = 0.18 }) {
  const s = size / 2;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? s * 0.95 : s * 0.42;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}
function Star12({ size = 80, color = "#22c55e", opacity = 0.13 }) {
  const s = size / 2;
  const pts = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI) / 12 - Math.PI / 2;
    const r = i % 2 === 0 ? s * 0.95 : s * 0.5;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}
function GeomTile({ size = 90, color = "#22c55e", opacity = 0.1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ opacity }}>
      <polygon points="27,5 63,5 85,27 85,63 63,85 27,85 5,63 5,27" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="45" y1="5" x2="45" y2="85" stroke={color} strokeWidth="0.8" />
      <line x1="5" y1="45" x2="85" y2="45" stroke={color} strokeWidth="0.8" />
      <line x1="14" y1="14" x2="76" y2="76" stroke={color} strokeWidth="0.8" />
      <line x1="76" y1="14" x2="14" y2="76" stroke={color} strokeWidth="0.8" />
      <polygon points="36,20 54,20 70,36 70,54 54,70 36,70 20,54 20,36" fill="none" stroke={color} strokeWidth="1" />
      <polygon points="45,30 60,45 45,60 30,45" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}
function Crescent({ size = 50, color = "#22c55e", opacity = 0.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ opacity }}>
      <path d="M25 5 A20 20 0 1 1 25 45 A14 14 0 1 0 25 5 Z" fill={color} />
    </svg>
  );
}
function LeftDecor() {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 160, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 10, left: -20 }}><Star12 size={110} color="#22c55e" opacity={0.12} /></div>
      <div style={{ position: "absolute", top: 18, left: 60 }}><IslamicStar size={40} color="#22c55e" opacity={0.18} /></div>
      <div style={{ position: "absolute", top: "35%", left: 8 }}><GeomTile size={80} color="#22c55e" opacity={0.13} /></div>
      <div style={{ position: "absolute", top: "40%", left: 70 }}><IslamicStar size={30} color="#22c55e" opacity={0.2} /></div>
      <div style={{ position: "absolute", bottom: "22%", left: 20 }}><Crescent size={48} color="#22c55e" opacity={0.18} /></div>
      <div style={{ position: "absolute", bottom: 10, left: -10 }}><GeomTile size={90} color="#22c55e" opacity={0.1} /></div>
      <div style={{ position: "absolute", bottom: 20, left: 65 }}><IslamicStar size={36} color="#22c55e" opacity={0.16} /></div>
      <svg width="2" height="100%" style={{ position: "absolute", right: 0, top: 0, opacity: 0.12 }}>
        <line x1="1" y1="0" x2="1" y2="100%" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 6" />
      </svg>
    </div>
  );
}
function RightDecor() {
  return (
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 10, right: -20 }}><Star12 size={110} color="#22c55e" opacity={0.12} /></div>
      <div style={{ position: "absolute", top: 18, right: 60 }}><IslamicStar size={40} color="#22c55e" opacity={0.18} /></div>
      <div style={{ position: "absolute", top: "35%", right: 8 }}><GeomTile size={80} color="#22c55e" opacity={0.13} /></div>
      <div style={{ position: "absolute", top: "40%", right: 70 }}><IslamicStar size={30} color="#22c55e" opacity={0.2} /></div>
      <div style={{ position: "absolute", bottom: "22%", right: 20, transform: "scaleX(-1)" }}><Crescent size={48} color="#22c55e" opacity={0.18} /></div>
      <div style={{ position: "absolute", bottom: 10, right: -10 }}><GeomTile size={90} color="#22c55e" opacity={0.1} /></div>
      <div style={{ position: "absolute", bottom: 20, right: 65 }}><IslamicStar size={36} color="#22c55e" opacity={0.16} /></div>
      <svg width="2" height="100%" style={{ position: "absolute", left: 0, top: 0, opacity: 0.12 }}>
        <line x1="1" y1="0" x2="1" y2="100%" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 6" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════
   Composant principal
══════════════════════════════════════ */
export default function Preche() {
  // Les données viennent directement du JSON importé
  const [selected, setSelected] = useState(preches[0]);
  const [playing, setPlaying]   = useState(false);
  const [animKey, setAnimKey]   = useState(0);

  const pick = (p) => {
    setSelected(p);
    setPlaying(false);
    setAnimKey((k) => k + 1);
  };

  const initial = selected.predicateur.split(" ").pop()[0].toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "#f2fbf6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Cormorant+Garamond:wght@600;700&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .anim-fade-up  { animation: fadeUp  .5s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-in { animation: slideIn .4s cubic-bezier(.22,1,.36,1) both; }

        .play-cover:hover .play-circle {
          transform: scale(1.1);
          box-shadow: 0 0 0 18px rgba(70,214,122,.2), 0 12px 40px rgba(15,119,85,.45);
        }
        .play-circle { transition: transform .2s ease, box-shadow .2s ease; }

        .p-card:hover:not(.p-card-active) {
          background: #e6f7ef !important;
          box-shadow: 0 6px 28px rgba(15,119,85,.13) !important;
          transform: translateY(-2px);
        }
        .p-card { transition: all .22s cubic-bezier(.22,1,.36,1); }
        .p-card:active { transform: scale(.99); }

        .btn-watch:hover { background: #0a5c41 !important; transform: translateY(-1px); box-shadow: 0 8px 26px rgba(15,119,85,.45) !important; }
        .btn-share:hover { background: #e6f7ef !important; transform: translateY(-1px); }
        .btn-watch, .btn-share { transition: all .18s ease; }
      `}</style>

      {/* ════ HEADER ════ */}
      <div style={{ position: "relative", paddingTop: 56, paddingBottom: 56, overflow: "hidden" }}>
        <LeftDecor />
        <RightDecor />
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dcfce7", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", letterSpacing: 2, textTransform: "uppercase" }}>
              Agenda islamique 2026
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,7vw,72px)", fontWeight: 700, color: "#0f172a", letterSpacing: -1, lineHeight: 1.05, marginBottom: 18 }}>
            Prêches
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Retrouvez les messages spirituels de notre communauté.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,transparent,#22c55e)" }} />
            <span style={{ color: "#22c55e", fontSize: 18 }}>✦</span>
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,#22c55e,transparent)" }} />
          </div>
        </div>
      </div>

      {/* ════ MAIN ════ */}
      <main className="max-w-3xl mx-auto px-5 pb-20">

        {/* ── Contenu ── */}
        <>
            {/* ── Featured player ── */}
            <div
              key={animKey}
              className="anim-fade-up flex flex-wrap rounded-3xl overflow-hidden mb-12 bg-white"
              style={{ border: "1.5px solid #D4F0E2", boxShadow: "0 8px 50px rgba(15,119,85,.12)" }}
            >
              {/* Vidéo */}
              <div className="relative overflow-hidden" style={{ flex: "0 0 320px", minWidth: 260, minHeight: 240, background: "#0a5036" }}>
                {!playing ? (
                  <div
                    className="play-cover absolute inset-0 flex items-center justify-center cursor-pointer"
                    style={{ background: "linear-gradient(140deg,#0F7755 0%,#072e20 100%)" }}
                    onClick={() => setPlaying(true)}
                  >
                    <div className="absolute rounded-full opacity-40"
                      style={{ width: 130, height: 130, background: "radial-gradient(circle,rgba(70,214,122,.3) 0%,transparent 70%)" }} />
                    <div className="play-circle relative z-10 flex items-center justify-center rounded-full"
                      style={{ width: 68, height: 68, background: "#46D67A", boxShadow: "0 0 0 10px rgba(70,214,122,.18),0 10px 36px rgba(15,119,85,.5)" }}>
                      <span style={{ display: "block", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid #0F7755", marginLeft: 5 }} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between z-10">
                      {[selected.serie, `⏱ ${selected.duree}`].map(t => (
                        <span key={t} className="text-white text-xs font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(0,0,0,.42)", backdropFilter: "blur(6px)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`${selected.youtube}?autoplay=1`}
                    title={selected.titre}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-7" style={{ minWidth: 240 }}>
                <span className="inline-block self-start text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
                  style={{ color: "#0F7755", background: "rgba(15,119,85,.08)", border: "1px solid rgba(15,119,85,.2)" }}>
                  {selected.serie}
                </span>
                <h2 className="mb-4 leading-snug"
                  style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#0D2B1F" }}>
                  {selected.titre}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center rounded-full text-white font-bold text-base flex-shrink-0"
                    style={{ width: 42, height: 42, background: "linear-gradient(135deg,#46D67A,#0F7755)", boxShadow: "0 3px 12px rgba(15,119,85,.3)" }}>
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0D2B1F" }}>{selected.predicateur}</p>
                    <p className="text-xs" style={{ color: "#7aaa92" }}>{selected.date} · {selected.duree}</p>
                  </div>
                </div>
                <hr className="mb-3" style={{ borderColor: "#D4F0E2" }} />
                <p className="text-sm leading-relaxed mb-2 flex-grow" style={{ color: "#2E6B52" }}>{selected.resume}</p>
                <p className="text-xs leading-relaxed mb-6" style={{ color: "#7aaa92" }}>{selected.description}</p>
                <div className="flex gap-2.5 flex-wrap">
                  {/* <button className="btn-watch inline-flex items-center gap-2 text-sm font-semibold text-white rounded-xl px-5 py-2.5 border-0 cursor-pointer"
                    style={{ background: "#0F7755", boxShadow: "0 4px 18px rgba(15,119,85,.32)" }}
                    onClick={() => setPlaying(true)}>
                    <span style={{ fontSize: 11 }}>▶</span> Regarder
                  </button>
                  <button className="btn-share inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-2.5 border cursor-pointer"
                    style={{ color: "#0F7755", background: "transparent", borderColor: "rgba(15,119,85,.3)" }}>
                    ↗ Partager
                  </button> */}
                </div>
              </div>
            </div>

            {/* ── Liste ── */}
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#0D2B1F" }}>
                Derniers prêches
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: "#0F7755", background: "rgba(15,119,85,.08)", border: "1px solid rgba(15,119,85,.18)" }}>
                {preches.length} message{preches.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {preches.map((p, i) => {
                const isActive = selected.id === p.id;
                return (
                  <button
                    key={p.id}
                    className={`p-card${isActive ? " p-card-active" : ""} anim-slide-in relative flex items-center overflow-hidden rounded-2xl text-left w-full border-0 cursor-pointer`}
                    style={{
                      animationDelay: `${i * 65}ms`,
                      background: isActive ? "#f0fbf5" : "#ffffff",
                      border: isActive ? "1.5px solid rgba(70,214,122,.4)" : "1.5px solid transparent",
                      boxShadow: isActive ? "0 4px 30px rgba(15,119,85,.16)" : "0 2px 16px rgba(15,119,85,.07)",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                    onClick={() => pick(p)}
                  >
                    {/* Barre active */}
                    <span className="absolute left-0 rounded-r w-1"
                      style={{ top: "50%", transform: "translateY(-50%)", height: 38, background: "#46D67A", opacity: isActive ? 1 : 0, transition: "opacity .2s ease" }} />

                    {/* Thumbnail */}
                    <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
                      style={{ width: 96, height: 88, background: "linear-gradient(140deg,#0F7755 0%,#07402c 100%)" }}>
                      <div className="flex items-center justify-center rounded-full"
                        style={{ width: 34, height: 34, background: "#46D67A", boxShadow: "0 4px 14px rgba(70,214,122,.45)" }}>
                        <span style={{ fontSize: 11, color: "#0F7755", fontWeight: 700, marginLeft: 2 }}>▶</span>
                      </div>
                      <span style={{ color: "rgba(255,255,255,.55)", fontSize: 10 }}>{p.duree}</span>
                    </div>

                    {/* Texte */}
                    <div className="flex-1 px-4 py-3.5 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#46D67A", fontSize: 10 }}>{p.serie}</p>
                      <h3 className="truncate mb-0.5" style={{ fontFamily: "'Fraunces',serif", fontSize: 14.5, fontWeight: 600, color: "#0D2B1F" }}>{p.titre}</h3>
                      <p className="text-xs font-medium mb-1" style={{ color: "#7aaa92" }}>{p.predicateur} · {p.date}</p>
                      <p className="text-xs leading-snug" style={{ color: "#2E6B52", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.resume}</p>
                    </div>

                    {/* Meta droite */}
                    <div className="flex flex-col items-end gap-1.5 pr-4 flex-shrink-0">
                      <span className="text-xs" style={{ color: "#7aaa92" }}>👁 {p.vues}</span>
                      {isActive && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ color: "#0F7755", background: "rgba(70,214,122,.18)", border: "1px solid rgba(70,214,122,.4)", fontSize: 10 }}>
                          En cours
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
        </>

      </main>
    </div>
  );
}