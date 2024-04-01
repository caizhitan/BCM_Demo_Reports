import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminIndex from '../Admin/Admin'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminIndex />} />
      </Routes>
    </Router>
  );
}

export default App;
