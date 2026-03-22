import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

// ---------------------- //
//       TYPES           //
// ---------------------- //

interface WPTitle {
  rendered: string;
}

interface WPContent {
  rendered: string;
}

interface WPEmbeddedMedia {
  id: number;
  source_url: string;
}

interface WPEmbedded {
  ["wp:featuredmedia"]?: WPEmbeddedMedia[];
}

interface WPPost {
  id: number;
  title: WPTitle;
  excerpt: WPContent;
  content: WPContent;
  featured_media: number;
  _embedded?: WPEmbedded;
}

export interface NewsItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

// ---------------------- //
//       COMPONENT        //
// ---------------------- //

export function NewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/posts?_embed&per_page=5`;

  const CACHE_KEY = "news_cache";
  const CACHE_TIME = 10 * 60 * 1000; // 10 minutos

  // ---------------------- //
  //     LOAD + CACHE       //
  // ---------------------- //
  useEffect(() => {
    async function loadPosts() {
      try {
        // 1. Verificar cache
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached) as {
            expires: number;
            data: NewsItem[];
          };

          if (Date.now() < parsed.expires) {
            setNews(parsed.data);
            setLoading(false);
            return;
          }
        }

        // 2. Buscar da API
        const res = await fetch(API_URL);
        const data: WPPost[] = await res.json();

        const mapped: NewsItem[] = data.map((post) => ({
          id: post.id,
          title: post.title.rendered,
          description: post.excerpt.rendered.replace(/<[^>]+>/g, ""),
          image:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
            "https://via.placeholder.com/900x600?text=Sem+Imagem",
        }));

        // 3. Salvar no cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            expires: Date.now() + CACHE_TIME,
            data: mapped,
          })
        );

        setNews(mapped);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  // ---------------------- //
  //     AUTO CARROSSEL     //
  // ---------------------- //

  useEffect(() => {
    if (news.length === 0) return;

    const duration = 5000;
    const interval = 50;

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / (duration / interval)));
    }, interval);

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
      setProgress(0);
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [currentIndex, news]);

  // ---------------------- //
  //       RENDER           //
  // ---------------------- //

  if (loading) {
    return <p className="text-white text-center">Carregando notícias...</p>;
  }

  if (news.length === 0) {
    return <p className="text-white text-center">Nenhuma notícia encontrada.</p>;
  }

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
        Últimas Notícias
      </h2>

      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {news.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                style={{
                  width:
                    index === currentIndex
                      ? `${progress}%`
                      : index < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Slide */}
        <div
          className="relative h-72 cursor-pointer"
          onClick={() => navigate(`/noticia/${news[currentIndex].id}`)}
        >
          <ImageWithFallback
            src={news[currentIndex].image}
            alt={news[currentIndex].title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3
              className="text-xl mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              dangerouslySetInnerHTML={{ __html: news[currentIndex].title }}
            />

            <p
              className="text-sm opacity-90"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {news[currentIndex].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
