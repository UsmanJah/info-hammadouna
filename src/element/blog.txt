// src/pages/Blog.jsx  –  migré vers l'API FastAPI
// Remplace : import blogData from "../data/blog.json";
// Par       : useApi("/blog")

import { useState } from "react";
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
        style={{ background: "#fff", boxShadow: "0 24px 80px rgba(15,119,85,.22)", maxHeight: "85vh", animation: "popUp .3s cubic-bezier(.22,1,.36,1) both" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #0F7755 0%, #07402c 100%)" }}>
          <div style={{ position: "absolute", right: 20, top: -10, opacity: 0.15 }}>
            <Star12 size={100} color="#46D67A" opacity={1} />
          </div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{article.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "rgba(70,214,122,.18)", color: "#46D67A", border: "1px solid rgba(70,214,122,.3)" }}>
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
            <button onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg"
              style={{ width: 36, height: 36, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>

        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
          <p className="text-sm leading-relaxed mb-6 font-medium" style={{ color: "#2E6B52" }}>
            {article.resume}
          </p>
          <div style={{ borderTop: "1px solid #D4F0E2", paddingTop: 20 }}>
            {/*
              Le champ "contenu" est désormais produit par l'éditeur de texte
              enrichi de l'admin (gras, souligné, alignement, listes, titres,
              citations…) et stocké sous forme de HTML. On l'injecte donc
              directement, stylé via la classe "rich-content" définie plus bas,
              au lieu de le parser manuellement (ancien découpage sur "\n\n"
              et "**...**").
            */}
            <div
              className="rich-content text-sm"
              style={{ color: "#374151", lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: article.contenu }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Blog() {
  const [openArticle, setOpenArticle] = useState(null);

  // ✅ API call – remplace l'import JSON statique
  const { data: articles, loading, error } = useApi("/blog");

  return (
    <div className="min-h-screen" style={{ background: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes popUp   { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .anim-fade-up  { animation: fadeUp  .55s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-in { animation: slideIn .4s  cubic-bezier(.22,1,.36,1) both; }
        .article-card { transition: all .22s cubic-bezier(.22,1,.36,1); cursor: pointer; }
        .article-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(15,119,85,.16) !important; }
        .article-card:hover .card-arrow { transform: translateX(4px); opacity:1; }
        .card-arrow { transition: transform .2s ease, opacity .2s ease; opacity: .5; }

        /* ── Styles pour le contenu enrichi (HTML) des articles ── */
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

        {/* États de chargement / erreur */}
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

        {/* Grille */}
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
                    {/* <span className="text-xs" style={{ color: "#7aaa92" }}>⏱ {a.lecture}</span> */}
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