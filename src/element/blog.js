import { useState } from "react";
import blogData from "../data/blog.json";

/* ── Destructuration des données depuis le JSON ── */
const { articles: ARTICLES} = blogData;

/* ── Islamic geometry SVG components ── */
function IslamicStar({ size = 60, color = "#22c55e", opacity = 0.18 }) {
  const s = size / 2;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8;
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

/* ── Article Popup ── */
function ArticleModal({ article, onClose }) {
  if (!article) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,15,0.65)", backdropFilter: "blur(6px)", animation: "fadeIn .2s ease both" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 24px 80px rgba(15,119,85,.22)",
          maxHeight: "85vh",
          animation: "popUp .3s cubic-bezier(.22,1,.36,1) both",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header band */}
        <div
          className="relative px-8 pt-8 pb-6"
          style={{ background: `linear-gradient(135deg, #0F7755 0%, #07402c 100%)` }}
        >
          <div style={{ position: "absolute", right: 20, top: -10, opacity: 0.15 }}>
            <Star12 size={100} color="#46D67A" opacity={1} />
          </div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{article.emoji}</span>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "rgba(70,214,122,.18)", color: "#46D67A", border: "1px solid rgba(70,214,122,.3)" }}
                >
                  {article.categorie}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
                {article.titre}
              </h2>
              <p className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
                {article.auteur} · {article.date} · {article.lecture} de lecture
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg"
              style={{ width: 36, height: 36, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
          <p className="text-sm leading-relaxed mb-6 font-medium" style={{ color: "#2E6B52" }}>
            {article.resume}
          </p>
          <div style={{ borderTop: "1px solid #D4F0E2", paddingTop: 20 }}>
            {article.contenu.split("\n\n").map((bloc, i) => {
              if (bloc.startsWith("**") && bloc.endsWith("**")) {
                return (
                  <h3 key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#0F7755", marginBottom: 10, marginTop: i > 0 ? 20 : 0 }}>
                    {bloc.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              const parts = bloc.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
                  {parts.map((p, j) =>
                    p.startsWith("**") ? (
                      <strong key={j} style={{ color: "#0F7755", fontWeight: 700 }}>{p.replace(/\*\*/g, "")}</strong>
                    ) : p
                  )}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #D4F0E2" }}>
          <span className="text-xs" style={{ color: "#7aaa92" }}>Partager cet article</span>
          <div className="flex gap-2">
            {["WhatsApp", "Copier"].map(label => (
              <button key={label} className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                style={{ background: "rgba(15,119,85,.08)", color: "#0F7755", border: "1px solid rgba(15,119,85,.2)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Blog() {
  const [openArticle, setOpenArticle] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes popUp {
          from { opacity:0; transform:scale(.94) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .anim-fade-up  { animation: fadeUp  .55s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-in { animation: slideIn .4s  cubic-bezier(.22,1,.36,1) both; }

        .article-card { transition: all .22s cubic-bezier(.22,1,.36,1); cursor: pointer; }
        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(15,119,85,.16) !important;
        }
        .article-card:hover .card-arrow { transform: translateX(4px); opacity:1; }
        .card-arrow { transition: transform .2s ease, opacity .2s ease; opacity: .5; }

        .livre-card { transition: all .2s ease; cursor: pointer; }
        .livre-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(15,119,85,.15) !important; }

        .btn-more:hover { background: #0a5c41 !important; transform: translateY(-1px); box-shadow: 0 8px 26px rgba(15,119,85,.4) !important; }
        .btn-more { transition: all .18s ease; }
      `}</style>

      {/* ════ HEADER ════ */}
      <div style={{ position: "relative", paddingTop: 56, paddingBottom: 56, overflow: "hidden" }}>
        <LeftDecor />
        <RightDecor />
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dcfce7", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", letterSpacing: 2, textTransform: "uppercase" }}>
              Blog & Ressources
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,7vw,72px)", fontWeight: 700, color: "#0f172a", letterSpacing: -1, lineHeight: 1.05, marginBottom: 18 }}>
            Articles & Lectures
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Approfondissez votre foi à travers des articles inspirants et des ressources soigneusement sélectionnées.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,transparent,#22c55e)" }} />
            <span style={{ color: "#22c55e", fontSize: 18 }}>✦</span>
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,#22c55e,transparent)" }} />
          </div>
        </div>
      </div>

      {/* ════ ARTICLES GRID ════ */}
      <main className="max-w-5xl mx-auto px-5 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#0D2B1F" }}>
            Articles récents
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: "#0F7755", background: "rgba(15,119,85,.08)", border: "1px solid rgba(15,119,85,.18)" }}>
            {ARTICLES.length} articles
          </span>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
          {ARTICLES.map((a, i) => (
            <div
              key={a.id}
              className="article-card anim-slide-in rounded-2xl overflow-hidden bg-white"
              style={{
                animationDelay: `${i * 70}ms`,
                boxShadow: "0 4px 20px rgba(15,119,85,.08)",
                border: "1.5px solid #D4F0E2",
              }}
              onClick={() => setOpenArticle(a)}
            >
              {/* Card top band */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: `linear-gradient(135deg, ${a.couleur}18 0%, ${a.couleur}08 100%)`, borderBottom: "1px solid #D4F0E2" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{a.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: a.couleur }}>
                    {a.categorie}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "#7aaa92" }}>⏱ {a.lecture}</span>
              </div>

              {/* Card body */}
              <div className="px-5 py-4">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: "#0D2B1F", lineHeight: 1.25, marginBottom: 8 }}>
                  {a.titre}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#2E6B52", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {a.resume}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full text-white font-bold text-xs flex-shrink-0"
                      style={{ width: 28, height: 28, background: `linear-gradient(135deg, #46D67A, #0F7755)`, fontSize: 10 }}>
                      {a.auteur[0]}
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#7aaa92" }}>{a.auteur}</span>
                  </div>
                  <span className="card-arrow text-sm font-bold" style={{ color: "#0F7755" }}>→</span>
                </div>
              </div>

              {/* Read button */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl w-full justify-center"
                  style={{ background: "rgba(15,119,85,.06)", color: "#0F7755", border: "1px solid rgba(15,119,85,.15)" }}>
                  Lire l'article ✦
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
    </div>
  );
}