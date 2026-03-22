import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WPText {
  rendered: string;
}

export interface LeisureArea {
  id: number;
  title: WPText;
  content: WPText;
  featured_media_url: string | null;
  area_image: string | null;
}

interface CleanLeisureArea extends LeisureArea {
  cleanDescription: string;
  finalImage: string;
}

// 🔥 Cache global de imagens (fica na memória)
const imageCache: Record<string, HTMLImageElement> = {};

// 🔥 Função para pré-carregar imagens com cache real
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (imageCache[url]) {
      resolve(); // já está em cache
      return;
    }

    const img = new Image();
    img.src = url;

    img.onload = () => {
      imageCache[url] = img; // salva no cache
      resolve();
    };

    img.onerror = () => resolve();
  });
}

export function LeisureCarousel() {
  const [areas, setAreas] = useState<LeisureArea[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 📌 1. Buscar áreas e pré-carregar todas as imagens
  useEffect(() => {
    async function loadData() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/areas-de-lazer?per_page=100`
      );

      const data: LeisureArea[] = await res.json();
      setAreas(data);

      // Criar lista de URLs
      const urls = data.map((area) =>
        area.area_image ||
        area.featured_media_url ||
        "https://via.placeholder.com/1200x600?text=Sem+imagem"
      );

      // Pré-carregar todas as imagens
      await Promise.all(urls.map((url) => preloadImage(url)));

      console.log("✨ Todas as imagens pré-carregadas no cache!");
    }

    loadData();
  }, []);

  // 📌 2. Limpar HTML + definir imagem final
  const cleanAreas: CleanLeisureArea[] = useMemo(() => {
    return areas.map((area) => ({
      ...area,
      cleanDescription: area.content.rendered.replace(/<[^>]+>/g, ""),
      finalImage:
        area.area_image ||
        area.featured_media_url ||
        "https://via.placeholder.com/1200x600?text=Sem+imagem",
    }));
  }, [areas]);

  // 📌 3. Controle da troca de slide com preload via cache
  useEffect(() => {
    if (cleanAreas.length === 0) return;

    setIsReady(false);

    const url = cleanAreas[currentIndex].finalImage;

    if (imageCache[url]) {
      // Se estiver em cache → instantâneo
      setIsReady(true);
    } else {
      preloadImage(url).then(() => setIsReady(true));
    }
  }, [currentIndex, cleanAreas]);

  if (cleanAreas.length === 0) {
    return <p className="text-white text-center">Carregando...</p>;
  }

  const area = cleanAreas[currentIndex];

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % cleanAreas.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + cleanAreas.length) % cleanAreas.length);

  return (
    <div className="mb-8">
      <h2
        className="text-center mb-6 text-white text-xl px-4"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        AS ÁREAS DE LAZER QUE FAZEM OS DIAS  MAIS DIVERTIDAS
      </h2>

      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-72">
          {/* Imagem com fade suave */}
          <ImageWithFallback
            src={area.finalImage}
            alt={area.title.rendered}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Texto */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-opacity duration-500 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3
              className="text-white text-xl mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              {area.title.rendered}
            </h3>

            <p
              className="text-sm opacity-90"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {area.cleanDescription}
            </p>
          </div>
        </div>

        {/* Botões */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-xl transition-all z-10"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-xl transition-all z-10"
          aria-label="Próximo"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {cleanAreas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-cyan-700 w-8" : "bg-gray-400 w-2"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
