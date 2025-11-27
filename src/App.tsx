import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewsPage from "./components/NewsPage";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Página completa da notícia */}
      <Route path="/noticia/:id" element={<NewsPage />} />
    </Routes>
  );
}
