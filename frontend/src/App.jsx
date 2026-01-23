import { BrowserRouter, Routes, Route } from "react-router-dom";
import Platforms from "./pages/Platforms";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GoalsPage from "./pages/GoalsPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/goals" element={<GoalsPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
