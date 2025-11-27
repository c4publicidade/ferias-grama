import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Atividade {
  horario: string;
  nome: string;
  local: string;
}

interface Categoria {
  id: number;
  name: string;
  slug: string;
}

interface LeisureArea {
  id: number;
  titulo: string;
  slug: string;
  data: string;
  imagem_fundo: string;
  info_extra: string;
  atividades: Atividade[];
  categorias: Categoria[];
}

interface ApiResponse {
  total: number;
  pages: number;
  page: number;
  per_page: number;
  results: LeisureArea[];
}

const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export function LeisureCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [leisureAreas, setLeisureAreas] = useState<LeisureArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (): Promise<void> => {
    try {
      setLoading(true);

      const apiUrl: string = import.meta.env.VITE_API_URL || "http://localhost:8087";
      const response = await fetch(`${apiUrl}/wp-json/programacoes/v1/ferias`);

      const data: ApiResponse = await response.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Adiciona tipo genérico explícito para filter
      const filtered = data.results.filter<LeisureArea>((activity: LeisureArea): activity is LeisureArea => {
        const activityDate = new Date(activity.data);
        return activityDate >= today;
      });

      // Adiciona tipo genérico explícito para sort
      const sorted = filtered.sort((a: LeisureArea, b: LeisureArea): number => {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      });

      setLeisureAreas(sorted);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = (): void => {
    setCurrentIndex((prev: number) => (prev + 1) % leisureAreas.length);
  };

  const prevSlide = (): void => {
    setCurrentIndex((prev: number) => (prev - 1 + leisureAreas.length) % leisureAreas.length);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      weekday: "long",
    });
  };

  const stripHtml = (html: string): string => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-center mb-6 text-white text-xl px-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
          AS ÁREAS DE LAZER QUE FAZEM AS FÉRIAS MAIS DIVERTIDAS
        </h2>
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-200 h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Carregando...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (leisureAreas.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-center mb-6 text-white text-xl px-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
          AS ÁREAS DE LAZER QUE FAZEM AS FÉRIAS MAIS DIVERTIDAS
        </h2>
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100 h-72 flex items-center justify-center">
          <p className="text-gray-600 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Nenhuma atividade programada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-center mb-6 text-white text-xl px-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
        AS ÁREAS DE LAZER QUE FAZEM AS FÉRIAS MAIS DIVERTIDAS
      </h2>

      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-72">
          <img
            src={leisureAreas[currentIndex].imagem_fundo}
            alt={leisureAreas[currentIndex].titulo}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
             {decodeHtml(leisureAreas[currentIndex].titulo)}
            </h3>

            {leisureAreas[currentIndex].categorias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {leisureAreas[currentIndex].categorias.map((cat: Categoria) => (
                  <span
                    key={cat.id}
                    className="text-white text-xs px-2 py-1 rounded-full"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {leisureAreas[currentIndex].info_extra && (
              <p className="text-sm opacity-90 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stripHtml(leisureAreas[currentIndex].info_extra)}
              </p>
            )}
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
        {leisureAreas.map((_item: LeisureArea, index: number) => (
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