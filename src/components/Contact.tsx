import { useEffect, useState } from "react";
import { motion } from "motion/react";
import logo from "../assets/ferias-logo.avif";
import beachBackground from "../assets/bg-ferias.webp";
import { BeachElements } from "./BeachElements";
import { Footer } from "./Footer";
import { MenuGrid } from "./MenuGrid";
import { Phone, Hash, RefreshCw } from "lucide-react";

// ----------------------
// TIPAGENS
// ----------------------
interface Contato {
  id: number;
  titulo: string;
  telefone: string;
  link?: string | null;
  ramal?: string | null;
  classe_titulo?: "text_red" | string;
}

interface ApiResponse {
  data: Contato[];
}

export default function Contact() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

const fetchContatos = async () => {
  const CACHE_KEY = "contatos_data";
  const CACHE_TIME_KEY = "contatos_data_time";
  const MAX_AGE = 10 * 60 * 1000; // 10 minutos

  const now = Date.now();

  // -------------------------
  // 1. Tentar carregar do cache
  // -------------------------
  const cached = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

  if (cached && cachedTime && now - Number(cachedTime) < MAX_AGE) {
    try {
      const parsed = JSON.parse(cached) as ApiResponse;
      setContatos(parsed.data || []);
      setLoading(false);
      console.log("CONTATOS: carregado do cache");
    } catch (e) {
      console.error("Erro ao ler cache:", e);
    }
  }

  // -------------------------
  // 2. Buscar do servidor e atualizar cache
  // -------------------------
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/api/v1/contatos`
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar contatos");
    }

    const data: ApiResponse = await response.json();
    setContatos(data.data || []);

    // salva versão nova no cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIME_KEY, String(now));

    console.log("CONTATOS API: atualizado e salvo no cache");
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido";

    setError(message);
    console.error("Erro ao buscar contatos:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchContatos();
}, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${beachBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        animate={{
          scale: [1, 1.05, 1],
          x: [0, -10, 0, 10, 0],
          y: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,247,230,0.15) 100%)",
        }}
      />
      <BeachElements />

      {/* Header */}
      <div className="relative pt-10  px-4 overflow-hidden">
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <a href="/">
              <img
                src={logo}
                alt="Férias da Grama"
                className="w-full max-w-xs h-auto drop-shadow-2xl"
                style={{
                  filter:
                    "drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(0,0,0,0.5))",
                }}
              />
            </a>
          </div>
        </div>      
      </div>
      {/* Conteúdo */}
      <div className="max-w-md mx-auto px-4 py-10 relative z-20 mb-8">


        <div className="mb-8 pt-10">
          <MenuGrid />
        </div>          
            <h2
            className="text-center mb-8 text-white text-xl px-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              letterSpacing: "1px",
            }}
          >
            Contatos Importantes
          </h2>
          <a className="text-center mb-8 text-white text-xl px-4" 
           style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              letterSpacing: "1px",
              display: 'flex'
            }}
          href="https://fazendadagrama.short.gy/proghome-horarios">Clique aqui para mais informações</a>
          <div className="grid grid-cols-1 gap-3 mt-6">

            {contatos.map((contato, index) => {
              // cores rotativas estilo MenuGrid
              const colors = [
                "bg-gradient-to-br from-[#0D4A5C] to-[#062935]",
                "bg-gradient-to-br from-[#C8D946] to-[#A4B837]",
                "bg-gradient-to-br from-[#F5A542] to-[#E88B1A]",
                "bg-gradient-to-br from-[#5D8456] to-[#3D5D36]",
                "bg-gradient-to-br from-[#F85C5C] to-[#E63939]",
              ];

            const color =
              contato.classe_titulo === "text_red"
                ? "bg-gradient-to-br from-[#F85C5C] to-[#E63939]"
                : colors[index % colors.length];

              return (
                <div
                  key={contato.id}
                  className={`${color} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform active:scale-95`}
                  style={{ fontFamily: "'Poppins', sans-serif", }}
                >
                <h3
                  className={`
                    text-xl font-bold mb-3 uppercase tracking-wide
                    ${contato.classe_titulo === "text_red" ? "text-white" : "text-gray-900"}
                  `}
                >
                  {contato.titulo}
                </h3>

                  {/* Ramal */}
                  {contato.ramal && (
                    <p className="flex items-center gap-2 text-white/90 text-sm mb-2">
                      <Hash size={18} /> Ramal: {contato.ramal}
                    </p>
                  )}

                  {/* Telefone */}
                  {contato.telefone && (
                    <p className="flex items-center gap-2 text-white/90 text-sm mb-2">
                      <Phone size={18} /> {contato.telefone}
                    </p>
                  )}

                  {/* Link */}
                  {contato.link && contato.link.trim() !== "" && (
                    <a
                      href={contato.link!.trim()}
                      className="inline-block mt-3 bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition"
                      // sem target="_blank" -> abre na mesma aba
                    >
                      Abrir link
                    </a>
                  )}
                </div>
              );
            })}

          </div>            
      </div>

      <Footer />
    </div>
  );
}