import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LeisureArea {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media_url: string | null;
  area_image: string | null;
}

export function LeisureCarousel() {
  const [areas, setAreas] = useState<LeisureArea[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/wp-json/wp/v2/areas-de-lazer?per_page=100`)
      .then((res) => res.json())
      .then((data) => {
        setAreas(data);
      });
  }, []);

  if (areas.length === 0) {
    return <p className="text-white text-center">Carregando...</p>;
  }

  const area = areas[currentIndex];

  const image =
    area.area_image ||
    area.featured_media_url ||
    "https://via.placeholder.com/1200x600?text=Sem+imagem";

  const description = area.content.rendered.replace(/<[^>]+>/g, "");

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % areas.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + areas.length) % areas.length);

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
        AS ÁREAS DE LAZER QUE FAZEM AS FÉRIAS MAIS DIVERTIDAS
      </h2>

      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-72">
          <ImageWithFallback
            src={image}
            alt={area.title.rendered}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
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
              {description}
            </p>
          </div>
        </div>

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

      <div className="flex justify-center gap-2 mt-6">
        {areas.map((_, index) => (
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
