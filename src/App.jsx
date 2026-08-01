import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Table from "./pages/Table";
import Game from "./pages/Game";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         
        <Route path="/table/:tableCode" element={<Table />} />
         
        <Route path="/game/:tableCode" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}