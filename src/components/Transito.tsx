import { useEffect, useState } from "react";
import { motion } from "motion/react";
import logo from "../assets/ferias-logo.avif";
import beachBackground from "../assets/bg-ferias.webp";
import { BeachElements } from "./BeachElements";
import { Footer } from "./Footer";
import { MenuGrid } from "./MenuGrid";

interface TransitoConfig {
  titulo_principal: string;
  geo_titulo: string;
  geo_btn_text: string;
  geo_link: string;
  geo_icon: string;
  limites_titulo: string;
  limites_placa1_img: string;
  limites_placa1_text: string;
  limites_placa2_img: string;
  vagas_titulo: string;
  vagas_img_deficiente: string;
  vagas_img_idoso: string;
  preferencia_titulo: string;
}

interface Aviso {
  id: number;
  texto_aviso: string;
}

interface Preferencia {
  id: number;
  titulo: string;
  icone: string;
}

interface TransitoResponse {
  success: boolean;
  data: {
    config: TransitoConfig;
    avisos: Aviso[];
    preferencias: Preferencia[];
  };
}

export default function Transito() {
  const [data, setData] = useState<TransitoResponse | null>(null);

  useEffect(() => {
  const CACHE_KEY = "transito_data";
  const CACHE_TIME_KEY = "transito_data_time";
  const MAX_AGE = 10 * 60 * 1000; // 10 minutos

  const now = Date.now();
  const cached = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

  // ---- 1. Se existe cache e ainda não expirou, usa ele ----
  if (cached && cachedTime && now - Number(cachedTime) < MAX_AGE) {
    try {
      const parsed = JSON.parse(cached) as TransitoResponse;
      setData(parsed);
      console.log("TRANSITO: carregado do cache");
    } catch (e) {
      console.error("Erro lendo cache:", e);
    }
  }

  // ---- 2. Busca atualizada no servidor e sobrescreve o cache ----
  fetch(`${import.meta.env.VITE_API_URL}/wp-json/api/v1/transito`)
    .then((r) => r.json())
    .then((json: TransitoResponse) => {
      setData(json);

      // salva cache atualizado
      localStorage.setItem(CACHE_KEY, JSON.stringify(json));
      localStorage.setItem(CACHE_TIME_KEY, String(now));

      console.log("TRANSITO API: atualizado e salvo no cache");
    })
    .catch((err) => console.error("Erro no endpoint:", err));
}, []);

  const config = data?.data?.config;
  const avisos = data?.data?.avisos || [];
  const preferencias = data?.data?.preferencias || [];

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
      <div className="relative pt-10 px-4 overflow-hidden">
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
          {config?.titulo_principal || "Trânsito"}
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
          href="https://fazendadagrama.short.gy/proghome-transito">Clique aqui para mais informações</a>
          <div className="grid grid-cols-1 gap-3 mt-6"></div>
        {/* ===================== */}
        {/* GEOLOCALIZAÇÃO       */}
        {/* ===================== */}
        {config && (
          <div className="mb-6 bg-gradient-to-br from-[#0D4A5C] to-[#062935] p-6 rounded-2xl shadow-lg text-white"
           
          >
            <h3 className="text-lg font-bold mb-3"
              style={{ textAlign: "center"}}
            >{config.geo_titulo}</h3>

            <button
             style={{ margin: "20px auto", display: "flex", borderRadius: "8px"}}
              onClick={() => window.open(config.geo_link, "_blank")}
              className="bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition mb-3"
            >
              {config.geo_btn_text}
            </button>

            <div className="flex justify-center mt-2">
              <img src={config.geo_icon} alt="Geo" className="w-14 h-14" />
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* AVISOS */}
        {/* ===================== */}
        {avisos.length > 0 && (
          <div className="space-y-3 mb-8 bg-gradient-to-br from-[#F5A542] to-[#E88B1A] p-6 rounded-2xl shadow-lg ">           
            {avisos.map((a) => (
              <div
                key={a.id}
                className="bg-yellow-300 font-semibold text-center p-3 rounded-xl shadow-md"
                style={{ color: "#51391b"}}
              >
                {a.texto_aviso}
              </div>
            ))}
          </div>
        )}


        {/* ===================== */}
        {/* LIMITES DE VELOCIDADE */}
        {/* ===================== */}
        {config && (
          <div className="bg-gradient-to-br from-[#5D8456] to-[#3D5D36] p-6 rounded-2xl shadow-lg text-white mb-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#c9eec1", textAlign: "center"}}>{config.limites_titulo}</h3>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <img
                  src={config.limites_placa1_img}  width="150" height="150" 
                  className="w-[150px] h-[150px] object-contain mx-auto"
                />
                {config.limites_placa1_text && (
                  <p className="mt-2">{config.limites_placa1_text}</p>
                )}
                <p className="mt-2" style={{ color: "#c9eec1", textAlign: "center", marginTop: "10px"}}>Vias com controle eletrônico de velocidade</p>
              </div>

              {/*<img
                src={config.limites_placa2_img} width="200" height="200" 
                className="w-[150px] h-[150px] mx-auto"
              />*/}
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* VAGAS ESPECIAIS */}
        {/* ===================== */}
        {config && (
          <div className="bg-gradient-to-br from-[#C8D946] to-[#A4B837] p-6 rounded-2xl shadow-lg text-white mb-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#424a17", textAlign: "center"}}>{config.vagas_titulo}</h3>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-9">
              <img src={config.vagas_img_deficiente} width="90" height="90" />
              <img src={config.vagas_img_idoso} width="90" height="90" />
            </div>
          </div>
        )}
        {/* ===================== */}
        {/* PREFERÊNCIA */}
        {/* ===================== */}
          {config && (
            <div className="bg-gradient-to-br from-[#F5A542] to-[#E88B1A] p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4" style={{ color: "#533715", textAlign: "center"}}>
                {config.preferencia_titulo}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                {preferencias.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white/20 p-3 rounded-xl shadow"
                  >
                    <p className="font-semibold mb-2" style={{ color: "#533715", textAlign: "center"}}>{p.titulo}</p>
                    <img src={p.icone} className="w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      <Footer />
    </div>
  );
}
