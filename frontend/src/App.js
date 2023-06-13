import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFoundPage from "./pages/404";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";


function App() {
  return (
    <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/*"  element={ <Home /> } />
          <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
