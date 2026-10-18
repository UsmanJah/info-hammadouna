// src/element/blog.js
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useApi } from "../hooks/useApi";

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

/* ── Pagination du contenu en "pages de livre" ── */
const PAGE_CHARS = 700; // Nombre de caractères approximatif par page : à ajuster

function paginateHtml(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");

  const blocks = [];
  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      blocks.push({ markup: node.outerHTML, text: node.textContent });
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      node.textContent
        .split(/\n\s*\n/)
        .filter((t) => t.trim())
        .forEach((t) => {
          const p = doc.createElement("p");
          p.textContent = t.trim();
          blocks.push({ markup: p.outerHTML, text: t });
        });
    }
  });

  const pages = [];
  let current = "";
  let size = 0;
  for (const b of blocks) {
    const len = b.text.length;
    if (size > 0 && size + len > PAGE_CHARS) {
      pages.push(current);
      current = "";
      size = 0;
    }
    current += b.markup;
    size += len;
  }
  if (current) pages.push(current);
  return pages;
}

const navBtnStyle = (disabled) => ({
  padding: "8px 14px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  whiteSpace: "nowrap",
  color: disabled ? "#b7cfc2" : "#0F7755",
  background: disabled ? "transparent" : "rgba(15,119,85,.08)",
  border: "1px solid rgba(15,119,85,.18)",
  cursor: disabled ? "default" : "pointer",
});

/* ── Page de garde ── */
function CoverPage({ article }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "linear-gradient(160deg, #0F7755 0%, #07402c 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "48px 40px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", right: -60, top: -60, opacity: 0.12 }}>
        <Star12 size={280} color="#46D67A" opacity={1} />
      </div>
      <div style={{ position: "absolute", left: -50, bottom: -50, opacity: 0.1 }}>
        <IslamicStar size={220} color="#46D67A" opacity={1} />
      </div>

      <span style={{ fontSize: 44, marginBottom: 18, position: "relative" }}>{article.emoji}</span>

      <span
        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{
          background: "rgba(70,214,122,.18)",
          color: "#46D67A",
          border: "1px solid rgba(70,214,122,.3)",
          position: "relative",
        }}
      >
        {article.categorie}
      </span>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 700,
          lineHeight: 1.15,
          margin: "22px 0 14px",
          maxWidth: 520,
          position: "relative",
        }}
      >
        {article.titre}
      </h2>

      <div style={{ width: 60, height: 2, background: "#46D67A", margin: "6px 0 18px", position: "relative" }} />

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.75,
          color: "rgba(255,255,255,.85)",
          maxWidth: 480,
          marginBottom: 26,
          position: "relative",
        }}
      >
        {article.resume}
      </p>

      <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", position: "relative" }}>
        {article.auteur} · {article.date} · {article.lecture} de lecture
      </p>
    </div>
  );
}

/* ── Lecteur type livre : occupe tout l'espace disponible ── */
function BookReader({ article }) {
  const contentPages = useMemo(() => paginateHtml(article.contenu), [article.contenu]);
  // Page 0 = page de garde, pages suivantes = contenu
  const total = contentPages.length + 1;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef(null);

  const go = useCallback(
    (delta) => {
      const next = index + delta;
      if (next < 0 || next >= total) return;
      setDir(delta);
      setIndex(next);
    },
    [index, total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const isLast = index === total - 1;

  return (
    <div
      className="flex flex-col"
      style={{ flex: 1, minHeight: 0 }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          background: "#fffdf8",
          borderRadius: 14,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "inset 0 0 0 1px #ebe5d6",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 14,
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(90deg, #cfe5d9 0%, rgba(255,253,248,0) 100%)",
          }}
        />

        <div
          key={index}
          className={dir > 0 ? "book-turn-next" : "book-turn-prev"}
          style={{ flex: 1, minHeight: 0, height: "100%", overflowY: "auto" }}
        >
          {index === 0 ? (
            <CoverPage article={article} />
          ) : (
            <div style={{ minHeight: "100%", boxSizing: "border-box", padding: "40px 44px 32px 50px" }}>
              <div
                className="rich-content"
                style={{ color: "#374151", lineHeight: 1.85, fontSize: 15 }}
                dangerouslySetInnerHTML={{ __html: contentPages[index - 1] }}
              />
            </div>
          )}
        </div>

        {index > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 18,
              fontSize: 12,
              fontWeight: 600,
              color: "#7aaa92",
              pointerEvents: "none",
            }}
          >
            {index} / {total - 1}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4" style={{ flexShrink: 0 }}>
        <button onClick={() => go(-1)} disabled={index === 0} style={navBtnStyle(index === 0)}>
          ← Précédente
        </button>

        <div style={{ flex: 1, height: 4, background: "#D4F0E2", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${((index + 1) / total) * 100}%`,
              background: "linear-gradient(90deg, #46D67A, #0F7755)",
              transition: "width .35s ease",
            }}
          />
        </div>

        <button onClick={() => go(1)} disabled={isLast} style={navBtnStyle(isLast)}>
          {isLast ? "Fin ✦" : "Suivante →"}
        </button>
      </div>
    </div>
  );
}

/* ── Popup livre plein écran ── */
function ArticleModal({ article, onClose }) {
  useEffect(() => {
    if (!article) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(15,23,15,0.65)", backdropFilter: "blur(6px)", animation: "fadeIn .2s ease both" }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth: 760,
          height: "min(92vh, 820px)",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 24px 80px rgba(15,119,85,.22)",
          padding: 16,
          boxSizing: "border-box",
          animation: "popUp .3s cubic-bezier(.22,1,.36,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute flex items-center justify-center rounded-full font-bold"
          style={{
            top: 10,
            right: 10,
            zIndex: 10,
            width: 34,
            height: 34,
            color: "#0F7755",
            background: "rgba(15,119,85,.08)",
            border: "1px solid rgba(15,119,85,.18)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <BookReader key={article.id} article={article} />
      </div>
    </div>
  );
}

/* ── Composant principal ── */
export default function Blog() {
  const [openArticle, setOpenArticle] = useState(null);
  const { data: articles, loading, error } = useApi("/blog");

  return (
    <div className="min-h-screen" style={{ background: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes popUp   { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes turnNext {
          from { opacity: 0; transform: perspective(1200px) rotateY(-14deg) translateX(24px); transform-origin: left center; }
          to   { opacity: 1; transform: none; }
        }
        @keyframes turnPrev {
          from { opacity: 0; transform: perspective(1200px) rotateY(14deg) translateX(-24px); transform-origin: right center; }
          to   { opacity: 1; transform: none; }
        }
        .book-turn-next { animation: turnNext .45s cubic-bezier(.22,1,.36,1) both; }
        .book-turn-prev { animation: turnPrev .45s cubic-bezier(.22,1,.36,1) both; }
        .anim-fade-up  { animation: fadeUp  .55s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-in { animation: slideIn .4s  cubic-bezier(.22,1,.36,1) both; }
        .article-card { transition: all .22s cubic-bezier(.22,1,.36,1); cursor: pointer; }
        .article-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(15,119,85,.16) !important; }
        .article-card:hover .card-arrow { transform: translateX(4px); opacity:1; }
        .card-arrow { transition: transform .2s ease, opacity .2s ease; opacity: .5; }

        .rich-content p { margin: 0 0 16px 0; }
        .rich-content p:last-child { margin-bottom: 0; }
        .rich-content h1, .rich-content h2, .rich-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: #0F7755;
          line-height: 1.25;
          margin: 24px 0 10px 0;
        }
        .rich-content h1:first-child, .rich-content h2:first-child, .rich-content h3:first-child { margin-top: 0; }
        .rich-content h1 { font-size: 22px; }
        .rich-content h2 { font-size: 20px; }
        .rich-content h3 { font-size: 18px; }
        .rich-content strong, .rich-content b { font-weight: 700; color: #0D2B1F; }
        .rich-content em, .rich-content i { font-style: italic; }
        .rich-content u { text-decoration: underline; }
        .rich-content s, .rich-content strike { text-decoration: line-through; }
        .rich-content blockquote {
          margin: 16px 0;
          padding: 10px 18px;
          border-left: 3px solid #0F7755;
          background: rgba(15,119,85,.06);
          color: #2E6B52;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        .rich-content ul, .rich-content ol { margin: 0 0 16px 0; padding-left: 22px; }
        .rich-content li { margin-bottom: 6px; }
        .rich-content a { color: #0F7755; text-decoration: underline; }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: "center", padding: "56px 0", animation: "fadeUp 0.6s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dcfce7", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", letterSpacing: 2, textTransform: "uppercase" }}>Blog & Ressources</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,7vw,72px)", fontWeight: 700, color: "#0f172a", letterSpacing: -1, lineHeight: 1.05, marginBottom: 18 }}>
          Articles & Lectures
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
          Approfondissez votre foi à travers des articles inspirants et des ressources soigneusement sélectionnées.
        </p>
      </div>

      {/* CONTENU */}
      <main className="max-w-5xl mx-auto px-5 pb-8">
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#7aaa92", fontSize: 15 }}>
            Chargement des articles…
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: 60, color: "#e11d48", fontSize: 14 }}>
            Erreur : {error}
          </div>
        )}

        {articles && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#0D2B1F" }}>
                Articles récents
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: "#0F7755", background: "rgba(15,119,85,.08)", border: "1px solid rgba(15,119,85,.18)" }}>
                {articles.length} articles
              </span>
            </div>

            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
              {articles.map((a, i) => (
                <div
                  key={a.id}
                  className="article-card anim-slide-in rounded-2xl overflow-hidden bg-white"
                  style={{ animationDelay: `${i * 70}ms`, boxShadow: "0 4px 20px rgba(15,119,85,.08)", border: "1.5px solid #D4F0E2" }}
                  onClick={() => setOpenArticle(a)}
                >
                  <div className="flex items-center justify-between px-5 py-4"
                    style={{ background: `linear-gradient(135deg, ${a.couleur ?? "#22c55e"}18 0%, ${a.couleur ?? "#22c55e"}08 100%)`, borderBottom: "1px solid #D4F0E2" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{a.emoji}</span>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: a.couleur ?? "#0F7755" }}>{a.categorie}</span>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: "#0D2B1F", lineHeight: 1.25, marginBottom: 8 }}>
                      {a.titre}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4"
                      style={{ color: "#2E6B52", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {a.resume}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full text-white font-bold text-xs flex-shrink-0"
                          style={{ width: 28, height: 28, background: "linear-gradient(135deg, #46D67A, #0F7755)", fontSize: 10 }}>
                          {a.auteur[0]}
                        </div>
                        <span className="text-xs font-medium" style={{ color: "#7aaa92" }}>{a.auteur}</span>
                      </div>
                      <span className="card-arrow text-sm font-bold" style={{ color: "#0F7755" }}>→</span>
                    </div>
                  </div>
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl w-full justify-center"
                      style={{ background: "rgba(15,119,85,.06)", color: "#0F7755", border: "1px solid rgba(15,119,85,.15)" }}>
                      Lire l'article ✦
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
    </div>
  );
}