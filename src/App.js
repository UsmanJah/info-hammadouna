import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Darrou from "./element/Home";


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Darrou />} />
      </Routes>

  
    </Router>
  );
}

export default App;