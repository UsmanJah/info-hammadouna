import { useState, useEffect, useCallback } from "react";
import { useApi, useMutation } from "../hooks/useApi";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const T = {
  bg:      "#F8F7F4",
  surface: "#FFFFFF",
  border:  "#E8E4DC",
  text:    "#1A1714",
  muted:   "#8C8278",
  accent:  "#2D6A4F",
  accent2: "#40916C",
  gold:    "#B5850B",
  red:     "#C0392B",
  blue:    "#1D6FA4",
  purple:  "#6B46C1",
};

const SECTION_META = {
  evenements:  { label: "Événements",    icon: "◈", color: T.accent,  endpoint: "/evenements"  },
  preches:     { label: "Prêches",        icon: "◎", color: T.blue,    endpoint: "/preches"     },
  preche_jour: { label: "Prêche du Jour", icon: "◐", color: T.gold,    endpoint: "/preche-jour" },
  blog:        { label: "Blog",           icon: "◉", color: T.purple,  endpoint: "/blog"        },
};

const today = () => new Date().toISOString().split("T")[0];

// ─── FIELD CONFIGS ───────────────────────────────────────────────────────────
const FIELDS = {
  evenements: [
    { key: "title",       label: "Titre",       type: "text",     required: true,  col: 2 },
    { key: "annee",       label: "Année",       type: "number",   required: true,  col: 1, default: new Date().getFullYear() },
    { key: "date",        label: "Date",        type: "date",     required: true,  col: 1, default: today() },
    { key: "heure",       label: "Heure",       type: "text",     required: true,  col: 1, placeholder: "09h00" },
    { key: "lieu",        label: "Lieu",        type: "text",     required: true,  col: 1, placeholder: "Grande Mosquée de Dakar" },
    { key: "category",    label: "Catégorie",   type: "select",   required: false, col: 1, options: ["Gamou","Ziarra","Conférence","Ismou"] },
    { key: "description", label: "Description", type: "textarea", required: true,  col: 2 },
  ],
  preches: [
    { key: "titre",        label: "Titre",        type: "text",     required: true,  col: 2 },
    { key: "predicateur",  label: "Prédicateur",  type: "text",     required: true,  col: 1, placeholder: "Sheikh Moussa" },
    { key: "date",         label: "Date",         type: "date",     required: true,  col: 1, default: today() },
    { key: "duree",        label: "Durée",        type: "text",     required: true,  col: 1, placeholder: "45 min" },
    { key: "serie",        label: "Série",        type: "text",     required: false, col: 1, placeholder: "Tawhid, Sîra…" },
    { key: "youtube_link", label: "Lien YouTube", type: "text",     required: false, col: 2, placeholder: "https://youtu.be/…" },
    { key: "resume",       label: "Résumé",       type: "textarea", required: false, col: 2, rows: 2 },
    { key: "description",  label: "Description",  type: "textarea", required: false, col: 2 },
  ],
  preche_jour: [
    { key: "titre",        label: "Titre",        type: "text",     required: true,  col: 2 },
    { key: "predicateur",  label: "Prédicateur",  type: "text",     required: true,  col: 1, placeholder: "Imam Diallo" },
    { key: "date",         label: "Date",         type: "date",     required: false, col: 1, default: today() },
    { key: "duree",        label: "Durée",        type: "text",     required: false, col: 1, placeholder: "12 min" },
    { key: "theme",        label: "Thème",        type: "text",     required: false, col: 1, placeholder: "Patience, Gratitude…" },
    { key: "categorie",    label: "Catégorie",    type: "select",   required: false, col: 1, options: ["Lettre de Baye","Jawahir Al Ma'ani"] },
    { key: "serie",        label: "Série",        type: "text",     required: false, col: 1, placeholder: "Nom de la série…" },
    { key: "youtube_link", label: "Lien YouTube", type: "text",     required: false, col: 1, placeholder: "https://youtu.be/…" },
    { key: "resume",       label: "Résumé",       type: "textarea", required: false, col: 2, rows: 2 },
    { key: "description",  label: "Description",  type: "textarea", required: false, col: 2 },
  ],
  blog: [
    { key: "titre",    label: "Titre",            type: "text",     required: true,  col: 2 },
    { key: "auteur",   label: "Auteur",           type: "text",     required: true,  col: 1, placeholder: "Sheikh Abdou" },
    { key: "categorie",label: "Catégorie",        type: "select",   required: true,  col: 1, options: ["Extrait de Djawahirou-l-Ma'ani","Extrait de Jawahir Ar Rassi'il","Premier Discours de 1978","Livre de Mawlana Thierno Amath Ndiaye","Recueil des disciples de la Jamma"] },
    { key: "date",     label: "Date",             type: "date",     required: true,  col: 1, default: today() },
    { key: "lecture",  label: "Temps de lecture", type: "text",     required: true,  col: 1, placeholder: "5 min" },
    { key: "emoji",    label: "Emoji",            type: "text",     required: false, col: 1, placeholder: "🕌" },
    { key: "resume",   label: "Résumé",           type: "textarea", required: false, col: 2, rows: 2 },
    { key: "contenu",  label: "Contenu",          type: "textarea", required: true,  col: 2, rows: 8 },
  ],
};

function defaultForm(section) {
  const obj = {};
  (FIELDS[section] || []).forEach(f => {
    obj[f.key] = f.default !== undefined ? f.default : "";
  });
  return obj;
}

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
const inp = (focused) => ({
  width: "100%", boxSizing: "border-box",
  background: focused ? "#FDFCFA" : T.bg,
  border: `1.5px solid ${focused ? T.accent : T.border}`,
  borderRadius: 8, padding: "9px 12px",
  color: T.text, fontSize: 13, fontFamily: "'Geist Mono', 'DM Mono', monospace",
  outline: "none", transition: "all .15s",
});

function FInput({ value, onChange, type = "text", placeholder, required }) {
  const [f, setF] = useState(false);
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
    style={inp(f)} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
}
function FTextarea({ value, onChange, placeholder, rows = 4, required }) {
  const [f, setF] = useState(false);
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required}
    style={{ ...inp(f), resize: "vertical", lineHeight: 1.6 }} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
}
function FSelect({ value, onChange, options, required }) {
  const [f, setF] = useState(false);
  return (
    <select value={value} onChange={onChange} required={required}
      style={{ ...inp(f), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238C8278' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      onFocus={() => setF(true)} onBlur={() => setF(false)}>
      <option value="">— choisir —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function FieldLabel({ label, required }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: .8, textTransform: "uppercase", color: T.muted, marginBottom: 5 }}>
      {label}{required && <span style={{ color: T.accent, marginLeft: 3 }}>*</span>}
    </label>
  );
}

function renderField(fieldDef, value, onChange) {
  const props = { value: value ?? "", onChange, placeholder: fieldDef.placeholder, required: fieldDef.required };
  if (fieldDef.type === "textarea") return <FTextarea {...props} rows={fieldDef.rows || 4} />;
  if (fieldDef.type === "select")   return <FSelect   {...props} options={fieldDef.options} />;
  return <FInput {...props} type={fieldDef.type} />;
}

function Btn({ children, onClick, variant = "primary", color, small, disabled, type = "button" }) {
  const [hov, setHov] = useState(false);
  const c = color || T.accent;
  const styles = {
    primary: { background: hov ? T.accent2 : c, color: "#fff", border: "none" },
    ghost:   { background: hov ? `${c}12` : "transparent", color: c, border: `1.5px solid ${hov ? c : T.border}` },
    danger:  { background: hov ? "#e74c3c" : T.red, color: "#fff", border: "none" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "6px 12px" : "9px 18px", borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s", opacity: disabled ? .5 : 1, fontFamily: "'Sora', sans-serif", ...styles[variant] }}>
      {children}
    </button>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30` }}>{text}</span>
  );
}

function Spinner({ color = T.accent }) {
  return <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: "50%", animation: "spin .7s linear infinite" }} />;
}

function Toast({ msg, ok, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: ok ? T.accent : T.red, color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,.18)", animation: "slideToast .3s ease both" }}>
      <span style={{ fontSize: 16 }}>{ok ? "✓" : "✕"}</span>{msg}
      <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 16, marginLeft: 4, lineHeight: 1 }}>×</button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(26,23,20,.55)", backdropFilter: "blur(4px)", animation: "fadeIn .15s ease" }}
      onClick={onClose}>
      <div style={{ background: T.surface, borderRadius: 16, width: "100%", maxWidth: 620, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,.2)", animation: "popIn .2s cubic-bezier(.34,1.4,.64,1) both" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Sora', sans-serif" }}>{title}</span>
          <button onClick={onClose} style={{ background: T.bg, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: T.muted, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ overflowY: "auto", padding: 24, flexGrow: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirmation" onClose={onCancel}>
      <p style={{ color: T.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onCancel}>Annuler</Btn>
        <Btn variant="danger" onClick={onConfirm}>Supprimer</Btn>
      </div>
    </Modal>
  );
}

// ─── GENERIC FORM ────────────────────────────────────────────────────────────
function GenericForm({ section, initial, onSubmit, loading, submitLabel = "Publier" }) {
  const [form, setForm] = useState(initial || defaultForm(section));
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const fields = FIELDS[section] || [];
  const meta = SECTION_META[section];

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (section === "evenements" && payload.annee) payload.annee = Number(payload.annee);
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {fields.map(f => (
          <div key={f.key} style={{ gridColumn: f.col === 2 ? "span 2" : "span 1" }}>
            <FieldLabel label={f.label} required={f.required} />
            {renderField(f, form[f.key], set(f.key))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <Btn type="submit" variant="primary" color={meta.color} disabled={loading}>
          {loading ? <><Spinner color="#fff" /> Envoi…</> : <><span>↑</span> {submitLabel}</>}
        </Btn>
      </div>
    </form>
  );
}

// ─── TABLE ───────────────────────────────────────────────────────────────────
function getLabel(item, section) {
  return item.title || item.titre || item.nom || `#${item.id}`;
}
function getSub(item, section) {
  if (section === "evenements")  return `${item.date} · ${item.lieu}`;
  if (section === "preches")     return `${item.predicateur} · ${item.date}`;
  if (section === "preche_jour") return `${item.predicateur} · ${item.date}`;
  if (section === "blog")        return `${item.auteur} · ${item.date} · ${item.lecture}`;
  return "";
}

function DataTable({ section, items, loading, error, onEdit, onDelete, accentColor }) {
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, gap: 10, color: T.muted }}>
      <Spinner color={accentColor} /> Chargement…
    </div>
  );
  if (error) return (
    <div style={{ padding: 40, textAlign: "center", color: T.red, fontSize: 13 }}>Erreur : {error}</div>
  );
  if (!items || items.length === 0) return (
    <div style={{ padding: 60, textAlign: "center", color: T.muted }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>∅</div>
      <div style={{ fontSize: 14 }}>Aucune donnée</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {items.map((item, i) => (
        <TableRow key={item.id} item={item} section={section} onEdit={onEdit} onDelete={onDelete} accentColor={accentColor} delay={i * 0.03} />
      ))}
    </div>
  );
}

function TableRow({ item, section, onEdit, onDelete, accentColor, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: hov ? `${accentColor}06` : T.surface, borderRadius: 10, border: `1px solid ${hov ? accentColor + "30" : T.border}`, transition: "all .15s", animation: `fadeRow .3s ease ${delay}s both` }}
    >
      {/* Color dot */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
          {getLabel(item, section)}
        </div>
        <div style={{ fontSize: 11, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {getSub(item, section)}
        </div>
      </div>

      {/* ID badge */}
      <Badge text={`#${item.id}`} color={accentColor} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0, opacity: hov ? 1 : 0, transition: "opacity .15s" }}>
        <Btn small variant="ghost" color={accentColor} onClick={() => onEdit(item)}>✎ Modifier</Btn>
        <Btn small variant="danger" onClick={() => onDelete(item)}>✕</Btn>
      </div>
    </div>
  );
}

// ─── SECTION PANEL ───────────────────────────────────────────────────────────
function SectionPanel({ section }) {
  const meta = SECTION_META[section];
  const { data, loading, error } = useApi(meta.endpoint);
  const { create, update, remove, loading: mutating } = useMutation(meta.endpoint);

  const [items, setItems]         = useState(null);
  const [view, setView]           = useState("list"); // list | create | edit
  const [editItem, setEditItem]   = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [toast, setToast]         = useState(null);

  // Sync data from API
  useEffect(() => { if (data) setItems(data); }, [data]);

  const notify = useCallback((ok, msg) => setToast({ ok, msg }), []);

  // CREATE — POST
  async function handleCreate(payload) {
    try {
      const created = await create(payload);
      setItems(prev => [created, ...(prev || [])]);
      notify(true, `"${getLabel(created, section)}" créé ✓`);
      setView("list");
    } catch (e) {
      notify(false, `Échec de la création : ${e.message}`);
    }
  }

  // EDIT — PUT
  // On ne met à jour l'état local qu'APRÈS confirmation du serveur.
  // Aucun fallback silencieux : si le PUT échoue, l'utilisateur le voit
  // et les données restent cohérentes avec le serveur après un refresh.
  async function handleEdit(payload) {
    try {
      const updated = await update(editItem.id, payload);
      const merged = { ...editItem, ...payload, ...(updated || {}) };
      setItems(prev => prev.map(x => x.id === editItem.id ? merged : x));
      notify(true, `"${getLabel(merged, section)}" modifié ✓`);
      setView("list");
      setEditItem(null);
    } catch (e) {
      notify(false, `Échec de la modification : ${e.message}`);
    }
  }

  // DELETE
  // Idem : suppression locale uniquement si le DELETE serveur a réussi.
  async function handleDelete(item) {
    try {
      await remove(item.id);
      setItems(prev => prev.filter(x => x.id !== item.id));
      notify(true, `"${getLabel(item, section)}" supprimé`);
    } catch (e) {
      notify(false, `Échec de la suppression : ${e.message}`);
    } finally {
      setConfirm(null);
    }
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Sub-header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {view !== "list" && (
            <button onClick={() => { setView("list"); setEditItem(null); }}
              style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 5 }}>
              ← Retour
            </button>
          )}
          <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>
            {view === "list"   && `${items?.length ?? "…"} enregistrement${(items?.length ?? 0) > 1 ? "s" : ""}`}
            {view === "create" && "Nouveau"}
            {view === "edit"   && `Modifier #${editItem?.id}`}
          </span>
        </div>
        {view === "list" && (
          <Btn variant="primary" color={meta.color} onClick={() => setView("create")}>
            + Nouveau
          </Btn>
        )}
      </div>

      {/* Content */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {view === "list" && (
          <DataTable
            section={section} items={items} loading={loading} error={error}
            accentColor={meta.color}
            onEdit={item => { setEditItem(item); setView("edit"); }}
            onDelete={item => setConfirm(item)}
          />
        )}
        {view === "create" && (
          <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24 }}>
            <GenericForm section={section} onSubmit={handleCreate} loading={mutating} />
          </div>
        )}
        {view === "edit" && editItem && (
          <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24 }}>
            <GenericForm section={section} initial={editItem} onSubmit={handleEdit} loading={mutating} submitLabel="Enregistrer" />
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirm && (
        <ConfirmModal
          message={`Supprimer "${getLabel(confirm, section)}" ? Cette action est irréversible.`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("evenements");
  const meta = SECTION_META[active];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Sora', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #B8B0A6; }
        select option { background: #fff; color: #1A1714; }
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes fadeIn     { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn      { from { opacity:0; transform:scale(.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes slideToast { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeRow    { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      {/* ── Top Bar ── */}
      <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff" }}>⬡</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: -.3 }}>Hamim Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
          API · {process.env.REACT_APP_API_URL || "localhost:8080"}
        </div>
      </header>

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <nav style={{ width: 200, background: T.surface, borderRight: `1px solid ${T.border}`, padding: "20px 10px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, padding: "0 10px", marginBottom: 8 }}>Ressources</p>
          {Object.entries(SECTION_META).map(([id, m]) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: isActive ? `${m.color}14` : "transparent", color: isActive ? m.color : T.muted, fontSize: 13, fontWeight: isActive ? 700 : 400, transition: "all .12s", textAlign: "left", fontFamily: "'Sora', sans-serif", borderLeft: `2px solid ${isActive ? m.color : "transparent"}` }}>
                <span style={{ fontSize: 15 }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </nav>

        {/* ── Main ── */}
        <main style={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Section title bar */}
          <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 18, color: meta.color }}>{meta.icon}</span>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{meta.label}</h1>
            <span style={{ fontSize: 11, color: T.muted, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 99, padding: "2px 10px", marginLeft: 4, fontFamily: "'DM Mono', monospace" }}>{meta.endpoint}</span>
          </div>

          {/* Content area */}
          <div style={{ flexGrow: 1, overflow: "hidden", padding: 24, display: "flex", flexDirection: "column" }} key={active}>
            <SectionPanel section={active}/>
          </div>
        </main>
      </div>
    </div>
  );
}