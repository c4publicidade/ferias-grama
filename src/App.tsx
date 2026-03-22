import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewsPage from "./components/NewsPage";
import Contact from "./components/Contact";
import Transito from "./components/Transito";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Página completa da notícia */}
      <Route path="/noticia/:id" element={<NewsPage />} />
      <Route path="/contatos-importantes" element={<Contact />} />
      <Route path="/transito" element={<Transito />} />
    </Routes>
  );
}
