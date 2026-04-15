import { useState, useEffect } from "react";
import Logo from '../assets/logo_jamma.png';

// ── ids identiques aux sections dans Home.js ──
const navItems = [
  { label: "A PROPOS",   id: "apropos"    },
  { label: "EVENEMENT",  id: "event"      },
  { label: "PRECHE",     id: "preche"     },
  { label: "BLOG",       id: "blog"       },
  { label: "CALENDRIER", id: "calendrier" },
  { label: "CONTACT",    id: "footer"     },
];

/* ── Icons ── */
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Réseaux sociaux avec liens ── */
const socials = [
  { 
    icon: <FacebookIcon />, 
    label: "Facebook", 
    color: "hover:text-blue-600",
    url: "https://www.facebook.com/profile.php?id=100069429655606&locale=fr_FR"
  },
  { 
    icon: <InstagramIcon />, 
    label: "Instagram", 
    color: "hover:text-pink-500",
    url: "https://www.instagram.com/jamhiyatou_hammadouna/"
  },
  { 
    icon: <YoutubeIcon />, 
    label: "YouTube", 
    color: "hover:text-red-500",
    url: "https://www.youtube.com/@Jamhiyatouhammadouna"
  },
];

function Navbar() {
  const [active, setActive]     = useState("apropos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNav = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = document.querySelector("header")?.offsetHeight ?? 72;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActive(id);
    setMenuOpen(false);
  };

  useEffect(() => {
    const observers = [];

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pill = (id) =>
    `px-4 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-200 whitespace-nowrap ${
      active === id
        ? "bg-green-500 text-white shadow-md"
        : "bg-transparent text-gray-700 hover:text-gray-900 hover:bg-white"
    }`;

  const pillSm = (id) =>
    `px-3 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-200 whitespace-nowrap ${
      active === id
        ? "bg-green-500 text-white shadow-md"
        : "bg-transparent text-gray-700 hover:text-gray-900"
    }`;

  const mobileItem = (id) =>
    `w-full text-left px-4 py-3 rounded-xl text-sm font-bold tracking-widest transition-all duration-200 ${
      active === id
        ? "bg-green-500 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  const socialLinks = (size = "p-2") =>
    socials.map(({ icon, label, color, url }) => (
      <a
        key={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`text-gray-500 ${color} transition-colors duration-200 ${size} rounded-full hover:bg-white hover:shadow-sm`}
      >
        {icon}
      </a>
    ));

  return (
    <header className={`bg-gray-100 w-full sticky top-0 z-50 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      
      {/* DESKTOP */}
      <div className="hidden lg:flex items-center justify-between min-h-[80px] px-8">

        <button onClick={() => handleNav("header")}>
          <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full" />
        </button>

        <nav className="flex bg-gray-200 rounded-full p-1.5">
          {navItems.map(({ label, id }) => (
            <button key={id} onClick={() => handleNav(id)} className={pill(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="flex gap-2">{socialLinks()}</div>
      </div>

      {/* TABLET */}
      <div className="hidden md:flex lg:hidden items-center justify-between px-6">

        <button onClick={() => handleNav("header")}>
          <img src={Logo} alt="Logo" className="w-9 h-9 rounded-full" />
        </button>

        <nav className="flex flex-wrap bg-gray-200 rounded-xl p-1.5">
          {navItems.map(({ label, id }) => (
            <button key={id} onClick={() => handleNav(id)} className={pillSm(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="flex gap-1">{socialLinks("p-1.5")}</div>
      </div>

      {/* MOBILE */}
      <div className="flex md:hidden justify-between px-4">

        <button onClick={() => handleNav("header")}>
          <img src={Logo} alt="Logo" className="w-9 h-9 rounded-full" />
        </button>

        <div className="flex items-center gap-1">
          {socialLinks("p-1.5")}

          <button onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {navItems.map(({ label, id }) => (
            <button key={id} onClick={() => handleNav(id)} className={mobileItem(id)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;