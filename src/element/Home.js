import React from "react";

// Import des sections
import Apropos    from "./apropos";
import Blog       from "./blog";
import Event      from "./event";
import Preche     from "./preche";
import Footer     from "./footer";
import Navbar     from "./navbar";
import Header     from "./header";
import Calendrier from "./calendrier";

function Darrou() {
  return (
    <div>
      <main>

        {/* Navbar sticky — pas besoin d'id de scroll */}
        <Navbar />

        {/* Header / Hero */}
        <section id="header">
          <Header />
        </section>

        {/* Sections scrollables — ids identiques aux navItems */}
        <section id="apropos">
          <Apropos />
        </section>

        <section id="event">
          <Event />
        </section>

        <section id="preche">
          <Preche />
        </section>

        <section id="blog">
          <Blog />
        </section>

        <section id="calendrier">
          <Calendrier />
        </section>

        {/* Footer — pas de scroll nav */}
         <section id="footer">
          <Footer />
        </section>

      </main>
    </div>
  );
}

export default Darrou;