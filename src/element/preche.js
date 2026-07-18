// src/pages/Preche.jsx  –  migré vers l'API FastAPI
// Remplace : import data1 from "../data/preche.json" + import data2 from "../data/preche-jour.json"
// Par       : useApi("/preches") + useApi("/preche-jour")

import { useState } from "react";
import { useApi } from "../hooks/useApi";

/* ══ Islamic geometry SVGs ══ */
function IslamicStar({ size = 60, color = "#22c55e", opacity = 0.18 }) {
  const s = size / 2;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? s * 0.95 : s * 0.42;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(" ");
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}><polygon points={pts} fill={color}/></svg>;
}

/* ══ Carte prêche journalier ══ */
function JournalierCard({ p, color, onPlay }) {
  return (
    <div
      style={{ display:"flex",alignItems:"center",overflow:"hidden",borderRadius:16,background:"#fff",border:`1.5px solid ${color}20`,boxShadow:"0 2px 14px rgba(15,119,85,.07)",cursor:"pointer" }}
      onClick={() => onPlay(p)}
    >
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,flexShrink:0,width:88,height:80,background:`linear-gradient(140deg,${color} 0%,${color}aa 100%)` }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",width:30,height:30,background:"#fff",boxShadow:`0 3px 10px ${color}44` }}>
          <span style={{ fontSize:10,color,fontWeight:700,marginLeft:2 }}>▶</span>
        </div>
        <span style={{ color:"rgba(255,255,255,.7)",fontSize:9,fontWeight:500 }}>{p.duree}</span>
      </div>
      <div style={{ flex:1,padding:"12px",minWidth:0 }}>
        <h4 style={{ fontFamily:"'Fraunces',serif",color:"#0D2B1F",fontSize:13.5,fontWeight:600,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.titre}</h4>
        <p style={{ color:"#7aaa92",fontSize:12,marginBottom:4 }}>{p.predicateur} · {p.date}</p>
        <p style={{ color:"#2E6B52",fontSize:12,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.resume}</p>
      </div>
    </div>
  );
}

/* ══ Modal lecteur vidéo ══ */
function VideoModal({ preche, onClose }) {
  const [playing, setPlaying] = useState(false);
  if (!preche) return null;
  return (
    <div
      style={{ position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(10,30,15,.75)",backdropFilter:"blur(6px)",animation:"fadeIn .2s ease both" }}
      onClick={onClose}
    >
      <div style={{ position:"relative",width:"100%",maxWidth:500,borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 24px 80px rgba(15,119,85,.35)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ position:"relative",paddingTop:"56.25%",background:"#0a2010" }}>
          {!playing ? (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(140deg,#0F7755 0%,#072e20 100%)",cursor:"pointer" }}
              onClick={() => setPlaying(true)}>
              <div style={{ width:68,height:68,background:"#46D67A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 0 10px rgba(70,214,122,.18)" }}>
                <span style={{ display:"block",width:0,height:0,borderTop:"12px solid transparent",borderBottom:"12px solid transparent",borderLeft:"20px solid #0F7755",marginLeft:5 }}/>
              </div>
            </div>
          ) : (
            <iframe
              src={`${preche.youtube_link}?autoplay=1`}
              title={preche.titre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:0 }}
            />
          )}
        </div>
        <div style={{ padding:20 }}>
          <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:600,color:"#0D2B1F",marginBottom:8 }}>{preche.titre}</h2>
          <p style={{ fontSize:13,color:"#7aaa92",marginBottom:12 }}>{preche.predicateur} · {preche.date} · {preche.duree}</p>
          {preche.resume && <p style={{ fontSize:13,color:"#2E6B52",lineHeight:1.6 }}>{preche.resume}</p>}
          <button onClick={onClose} style={{ marginTop:16,padding:"8px 20px",borderRadius:10,background:"#0F7755",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:600 }}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

/* ══ Utilitaire : parse une date en {annee, mois, jour} ══ */
const MOIS_NOMS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function parseDate(str) {
  if (!str) return null;
  // Format ISO : YYYY-MM-DD
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return { annee: m[1], mois: m[2].padStart(2,"0"), jour: m[3].padStart(2,"0") };
  // Format DD/MM/YYYY ou DD-MM-YYYY
  m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (m) return { annee: m[3], mois: m[2].padStart(2,"0"), jour: m[1].padStart(2,"0") };
  // Fallback : tentative via Date native
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return { annee: String(d.getFullYear()), mois: String(d.getMonth()+1).padStart(2,"0"), jour: String(d.getDate()).padStart(2,"0") };
  }
  return null;
}

/* ══ Vue : Prêches journaliers ══ */
function VueJournaliers() {
  const [playing, setPlaying]         = useState(null);
  const [filtreCat, setFiltreCat]     = useState("tous");
  const [filtreAnnee, setFiltreAnnee] = useState("toutes");
  const [filtreMois, setFiltreMois]   = useState("tous");
  const [filtreJour, setFiltreJour]   = useState("tous");
  // ✅ API call pour les prêches journaliers
  const { data: prechesJournaliers, loading, error } = useApi("/preche-jour");

  const COLORS = ["#0F7755","#1a8a6a","#22c55e","#46D67A","#2E6B52"];

  if (loading) return <div style={{ textAlign:"center",padding:40,color:"#7aaa92" }}>Chargement…</div>;
  if (error)   return <div style={{ textAlign:"center",padding:40,color:"#e11d48",fontSize:13 }}>Erreur : {error}</div>;

  const liste = prechesJournaliers ?? [];

  // Pré-calcul des dates parsées {annee, mois, jour} pour chaque prêche
  const listeAvecDate = liste.map(p => ({ ...p, _d: parseDate(p.date) }));

  // Valeurs uniques disponibles pour les filtres
  const categories = Array.from(new Set(liste.map(p => p.categorie).filter(Boolean)));

  const annees = Array.from(new Set(listeAvecDate.map(p => p._d?.annee).filter(Boolean))).sort((a, b) => b.localeCompare(a));

  const mois = Array.from(new Set(
    listeAvecDate
      .filter(p => filtreAnnee === "toutes" || p._d?.annee === filtreAnnee)
      .map(p => p._d?.mois)
      .filter(Boolean)
  )).sort();

  const jours = Array.from(new Set(
    listeAvecDate
      .filter(p =>
        (filtreAnnee === "toutes" || p._d?.annee === filtreAnnee) &&
        (filtreMois === "tous"    || p._d?.mois  === filtreMois)
      )
      .map(p => p._d?.jour)
      .filter(Boolean)
  )).sort();

  // Application des filtres
  const filtres = listeAvecDate.filter(p => {
    const okCat   = filtreCat   === "tous"   || p.categorie === filtreCat;
    const okAnnee = filtreAnnee === "toutes" || p._d?.annee === filtreAnnee;
    const okMois  = filtreMois  === "tous"   || p._d?.mois  === filtreMois;
    const okJour  = filtreJour  === "tous"   || p._d?.jour  === filtreJour;
    return okCat && okAnnee && okMois && okJour;
  });

  const hasActiveFilters = filtreCat !== "tous" || filtreAnnee !== "toutes" || filtreMois !== "tous" || filtreJour !== "tous";

  function onChangeAnnee(v) { setFiltreAnnee(v); setFiltreMois("tous"); setFiltreJour("tous"); }
  function onChangeMois(v)  { setFiltreMois(v);  setFiltreJour("tous"); }

  const selectStyle = {
    appearance:"none",
    fontSize:12.5,
    fontWeight:600,
    color:"#0D2B1F",
    background:"#fff",
    border:"1.5px solid rgba(15,119,85,.2)",
    borderRadius:10,
    padding:"8px 30px 8px 14px",
    cursor:"pointer",
    backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F7755' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>")`,
    backgroundRepeat:"no-repeat",
    backgroundPosition:"right 10px center",
    backgroundSize:14,
    outline:"none",
  };

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12 }}>
        <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:600,color:"#0D2B1F" }}>Prêches du Jour</h2>
        <span style={{ fontSize:12,fontWeight:700,color:"#0F7755",background:"rgba(15,119,85,.08)",border:"1px solid rgba(15,119,85,.18)",borderRadius:99,padding:"4px 12px" }}>
          {filtres.length} message{filtres.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* ══ Barre de filtres ══ */}
      <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:22,padding:14,background:"#f8fdfb",border:"1px solid rgba(15,119,85,.1)",borderRadius:14 }}>
        <span style={{ fontSize:11,fontWeight:700,color:"#7aaa92",textTransform:"uppercase",letterSpacing:.5,marginRight:2 }}>Filtrer :</span>

        <select value={filtreCat} onChange={e => setFiltreCat(e.target.value)} style={selectStyle}>
          <option value="tous">Toutes les catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={filtreAnnee} onChange={e => onChangeAnnee(e.target.value)} style={selectStyle}>
          <option value="toutes">Année</option>
          {annees.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select value={filtreMois} onChange={e => onChangeMois(e.target.value)} style={selectStyle} disabled={annees.length === 0}>
          <option value="tous">Mois</option>
          {mois.map(m => <option key={m} value={m}>{MOIS_NOMS[parseInt(m, 10) - 1] ?? m}</option>)}
        </select>

        <select value={filtreJour} onChange={e => setFiltreJour(e.target.value)} style={selectStyle} disabled={annees.length === 0}>
          <option value="tous">Jour</option>
          {jours.map(j => <option key={j} value={j}>{j}</option>)}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => { setFiltreCat("tous"); setFiltreAnnee("toutes"); setFiltreMois("tous"); setFiltreJour("tous"); }}
            style={{ fontSize:12,fontWeight:600,color:"#e11d48",background:"rgba(225,29,72,.06)",border:"1px solid rgba(225,29,72,.2)",borderRadius:10,padding:"8px 14px",cursor:"pointer" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {filtres.length === 0 ? (
        <div style={{ textAlign:"center",padding:"48px 20px",color:"#7aaa92",fontSize:13.5,background:"#f8fdfb",borderRadius:16,border:"1px dashed rgba(15,119,85,.2)" }}>
          Aucun prêche ne correspond à ces filtres.
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {filtres.map((p, i) => (
            <JournalierCard key={p.id} p={p} color={p.couleur ?? COLORS[i % COLORS.length]} onPlay={setPlaying}/>
          ))}
        </div>
      )}

      <VideoModal preche={playing} onClose={() => setPlaying(null)}/>
    </div>
  );
}

/* ══ Main Component ══ */
export default function Preche() {
  const [vue, setVue]           = useState("preches");
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying]   = useState(false);

  // ✅ API call – remplace les imports JSON statiques
  const { data: preches, loading, error } = useApi("/preches");

  // Sélectionne le premier prêche par défaut dès que les données arrivent
  const current = selected ?? (preches?.[0] ?? null);
  const initial = current?.predicateur?.[0] ?? "?";

  function pick(p) { setSelected(p); setPlaying(false); }

  return (
    <div style={{ minHeight:"100vh",background:"#ffffff",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:wght@600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .anim-slide-in { animation:slideIn .4s cubic-bezier(.22,1,.36,1) both; }
        .p-card { transition:all .2s ease; }
        .p-card:hover { box-shadow:0 6px 28px rgba(15,119,85,.18) !important; transform:translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:"center",padding:"48px 0 32px",animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"#dcfce7",borderRadius:99,padding:"6px 16px",marginBottom:16 }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block" }}/>
          <span style={{ fontSize:12,fontWeight:700,color:"#15803d",letterSpacing:2,textTransform:"uppercase" }}>Médiathèque</span>
        </div>
        <h1 style={{ fontFamily:"'Fraunces',serif",fontSize:"clamp(36px,6vw,64px)",fontWeight:700,color:"#0f172a",letterSpacing:-1,marginBottom:16 }}>Prêches & Enseignements</h1>
        {/* Onglets */}
        <div style={{ display:"inline-flex",gap:4,background:"#f1f5f9",borderRadius:14,padding:4 }}>
          {[["preches","Ligne directrice"],["journaliers","Prêches Journaliers"]].map(([val,label]) => (
            <button key={val} onClick={() => setVue(val)}
              style={{ padding:"8px 22px",borderRadius:11,fontSize:13,fontsWeight:700,border:"none",cursor:"pointer",transition:"all .18s ease",background: vue===val?"#0F7755":"transparent",color: vue===val?"#fff":"#64748b",boxShadow: vue===val?"0 2px 10px rgba(15,119,85,.3)":"none" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth:900,margin:"0 auto",padding:"0 20px 48px" }}>

        {/* ══ Vue : Prêches ══ */}
        {vue === "preches" && (
          <>
            {loading && <div style={{ textAlign:"center",padding:60,color:"#7aaa92" }}>Chargement des prêches…</div>}
            {error   && <div style={{ textAlign:"center",padding:60,color:"#e11d48",fontSize:13 }}>Erreur : {error}</div>}

            {preches && current && (
              <>
                {/* Lecteur principal */}
                <div style={{ display:"flex",flexWrap:"wrap",borderRadius:24,overflow:"hidden",background:"#fff",boxShadow:"0 8px 40px rgba(15,119,85,.12)",border:"1px solid #D4F0E2",marginBottom:28 }}>
                  <div style={{ flex:"1 1 300px",position:"relative",paddingTop:"min(56.25%, 260px)",background:"#0a2010" }}>
                    {!playing ? (
                      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(140deg,#0F7755 0%,#072e20 100%)",cursor:"pointer" }}
                        onClick={() => setPlaying(true)}>
                        <div style={{ width:68,height:68,background:"#46D67A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 0 10px rgba(70,214,122,.18),0 10px 36px rgba(15,119,85,.5)" }}>
                          <span style={{ display:"block",width:0,height:0,borderTop:"12px solid transparent",borderBottom:"12px solid transparent",borderLeft:"20px solid #0F7755",marginLeft:5 }}/>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={`${current.youtube_link}?autoplay=1`}
                        title={current.titre}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:0 }}
                      />
                    )}
                  </div>

                  <div style={{ flex:"1 1 240px",padding:28,display:"flex",flexDirection:"column" }}>
                    {current.serie && (
                      <span style={{ display:"inline-block",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#0F7755",background:"rgba(15,119,85,.08)",border:"1px solid rgba(15,119,85,.2)",borderRadius:99,padding:"4px 12px",marginBottom:12,alignSelf:"flex-start" }}>
                        {current.serie}
                      </span>
                    )}
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:600,color:"#0D2B1F",lineHeight:1.25,marginBottom:16 }}>{current.titre}</h2>
                    <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                      <div style={{ width:42,height:42,background:"linear-gradient(135deg,#46D67A,#0F7755)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0 }}>
                        {initial}
                      </div>
                      <div>
                        <p style={{ fontSize:14,fontWeight:600,color:"#0D2B1F" }}>{current.predicateur}</p>
                        <p style={{ fontSize:12,color:"#7aaa92" }}>{current.date} · {current.duree}</p>
                      </div>
                    </div>
                    {current.resume && <p style={{ fontSize:13,color:"#2E6B52",lineHeight:1.6,marginBottom:8,flex:1 }}>{current.resume}</p>}
                    {current.description && <p style={{ fontSize:12,color:"#7aaa92",lineHeight:1.5,marginBottom:20 }}>{current.description}</p>}
                    <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                      <button onClick={() => setPlaying(true)}
                        style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",background:"#0F7755",color:"#fff",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,boxShadow:"0 4px 18px rgba(15,119,85,.32)" }}>
                        <span style={{ fontSize:10 }}>▶</span> Regarder
                      </button>
                      {current.youtube_link && (
                        <a href={current.youtube_link} target="_blank" rel="noopener noreferrer"
                          style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"10px 16px",color:"#0F7755",borderRadius:12,border:"1px solid rgba(15,119,85,.3)",fontSize:13,fontWeight:600,textDecoration:"none" }}>
                          ↗ YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Liste */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                  <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:600,color:"#0D2B1F" }}>Derniers prêches</h2>
                  <span style={{ fontSize:12,fontWeight:700,color:"#0F7755",background:"rgba(15,119,85,.08)",border:"1px solid rgba(15,119,85,.18)",borderRadius:99,padding:"4px 12px" }}>
                    {preches.length} messages
                  </span>
                </div>

                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {preches.map((p, i) => {
                    const isActive = current.id === p.id;
                    return (
                      <button key={p.id}
                        className={`p-card anim-slide-in`}
                        style={{ animationDelay:`${i*65}ms`,display:"flex",alignItems:"center",overflow:"hidden",borderRadius:16,textAlign:"left",width:"100%",border: isActive?"1.5px solid rgba(70,214,122,.4)":"1.5px solid transparent",background: isActive?"#f0fbf5":"#fff",boxShadow: isActive?"0 4px 30px rgba(15,119,85,.16)":"0 2px 16px rgba(15,119,85,.07)",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:0 }}
                        onClick={() => pick(p)}>
                        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,flexShrink:0,width:96,height:88,background:"linear-gradient(140deg,#0F7755 0%,#07402c 100%)" }}>
                          <div style={{ width:34,height:34,background:"#46D67A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(70,214,122,.45)" }}>
                            <span style={{ fontSize:11,color:"#0F7755",fontWeight:700,marginLeft:2 }}>▶</span>
                          </div>
                          <span style={{ color:"rgba(255,255,255,.55)",fontSize:10 }}>{p.duree}</span>
                        </div>
                        <div style={{ flex:1,padding:"14px 16px",minWidth:0 }}>
                          {p.serie && <p style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#46D67A",marginBottom:2 }}>{p.serie}</p>}
                          <h3 style={{ fontFamily:"'Fraunces',serif",fontSize:14.5,fontWeight:600,color:"#0D2B1F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{p.titre}</h3>
                          <p style={{ fontSize:12,fontWeight:500,color:"#7aaa92",marginBottom:4 }}>{p.predicateur} · {p.date}</p>
                          {p.resume && <p style={{ fontSize:12,color:"#2E6B52",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.resume}</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* ══ Vue : Prêches journaliers ══ */}
        {vue === "journaliers" && <VueJournaliers />}
      </main>
    </div>
  );
}