import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ModalData {
  id: number;
  enabled: string;
  title: string;
  description: string;
  btn1_text?: string;
  btn1_link?: string;
  btn2_text?: string;
  btn2_link?: string;
  display_type?: string;
  days?: string[];
  start_time?: string;
  end_time?: string;
}

/**
 * Verifica se o modal deve ser exibido baseado nas configurações
 */
function shouldShowModal(modal: ModalData): boolean {
  const storageKey = `swell_modal_${modal.id}`;
  const displayType = modal.display_type || 'always';

  // Se for "always", sempre exibe
  if (displayType === 'always') {
    return true;
  }

  // Se for "once", verifica se já foi exibido alguma vez
  if (displayType === 'once') {
    const shown = localStorage.getItem(storageKey);
    if (shown) {
      return false; // Já foi exibido, não mostra mais
    }
    return true;
  }

  // Se for "once_per_day", verifica se já foi exibido hoje
  if (displayType === 'once_per_day') {
    const lastShown = localStorage.getItem(storageKey);
    if (lastShown) {
      const lastDate = new Date(lastShown);
      const today = new Date();
      
      // Verifica se é o mesmo dia
      const isSameDay = 
        lastDate.getFullYear() === today.getFullYear() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getDate() === today.getDate();
      
      if (isSameDay) {
        return false; // Já foi exibido hoje
      }
    }
    return true;
  }

  // Se for "custom", verifica dias da semana e horários
  if (displayType === 'custom') {
    const now = new Date();
    
    // Verifica dias da semana
    if (modal.days && modal.days.length > 0) {
      const dayMap: { [key: string]: number } = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3,
        'thu': 4, 'fri': 5, 'sat': 6
      };
      
      const currentDay = now.getDay();
      const allowedDays = modal.days.map(d => dayMap[d]);
      
      if (!allowedDays.includes(currentDay)) {
        return false; // Não é um dia permitido
      }
    }

    // Verifica horários
    if (modal.start_time && modal.end_time) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [startHour, startMin] = modal.start_time.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      
      const [endHour, endMin] = modal.end_time.split(':').map(Number);
      const endTime = endHour * 60 + endMin;
      
      if (currentTime < startTime || currentTime > endTime) {
        return false; // Fora do horário permitido
      }
    }

    // Se passou nas validações custom, verifica se já foi exibido hoje
    const lastShown = localStorage.getItem(storageKey);
    if (lastShown) {
      const lastDate = new Date(lastShown);
      const today = new Date();
      
      const isSameDay = 
        lastDate.getFullYear() === today.getFullYear() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getDate() === today.getDate();
      
      if (isSameDay) {
        return false;
      }
    }
    
    return true;
  }

  return true;
}

/**
 * Marca o modal como visualizado
 */
function markModalAsShown(modalId: number, displayType: string): void {
  const storageKey = `swell_modal_${modalId}`;
  
  if (displayType === 'once') {
    // Para "once", marca com um valor fixo
    localStorage.setItem(storageKey, 'shown');
  } else if (displayType === 'once_per_day' || displayType === 'custom') {
    // Para "once_per_day" e "custom", salva a data/hora atual
    localStorage.setItem(storageKey, new Date().toISOString());
  }
  // Para "always" não precisa salvar nada
}

export default function FeriasModal() {
  const [modal, setModal] = useState<ModalData | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadModal(): Promise<void> {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/swell/v1/modal?page=ferias`
        );

        const data: ModalData = await res.json();

        if (data?.enabled === "on" && data.id) {
          // Verifica se o modal deve ser exibido
          if (shouldShowModal(data)) {
            setModal(data);
            setOpen(true);
            
            // Marca como visualizado
            markModalAsShown(data.id, data.display_type || 'always');
          }
        }
      } catch (err) {
        console.error("Erro ao carregar modal:", err);
      }
    }

    loadModal();
  }, []);

  if (!modal) return null;

  return (
<AnimatePresence>
  {open && (
    <>
      {/* BACKDROP - SEM onClick aqui */}
      <motion.div
        className="fixed inset-0 z-[999998]"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: "9999999999999999"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* MODAL - ADICIONE onClick aqui para fechar ao clicar fora */}
      <motion.div
        className="fixed inset-0 z-[999999] flex items-center justify-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{
          zIndex: "9999999999999999",
          pointerEvents: "auto"  // ← Mude para auto
        }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        onClick={() => setOpen(false)}  // ← ADICIONE AQUI (fecha ao clicar fora)
      >
        <motion.div
          className="relative w-full max-w-lg pointer-events-auto"
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          style={{ width: "500px" }}
          exit={{ scale: 0.8, rotate: 5 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}  // ← ADICIONE AQUI (impede fechar ao clicar dentro)
        >
              {/* CARD PRINCIPAL */}
              <div 
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
                  borderRadius: "30px",
                  padding: "2px",
                  boxShadow: '0 25px 50px -12px rgba(38, 166, 154, 0.3)',
                }}
              >
                {/* PADRÃO DE ONDAS DE FUNDO */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 35px,
                        rgba(255,255,255,.3) 35px,
                        rgba(255,255,255,.3) 70px
                      )
                    `,
                  }}
                />

                {/* CONTEÚDO */}
                <div className="relative bg-white/98 backdrop-blur-sm rounded-3xl p-8">
                  {/* BOTÃO FECHAR */}
                  <motion.button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl shadow-lg hover:scale-110 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #4DD0E1 0%, #26A69A 100%)',
                    }}
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Fechar modal"
                  >
                    ×
                  </motion.button>

                  {/* EMOJI DECORATIVO */}
                  <motion.div
                    className="text-6xl text-center mb-4"
                    animate={{
                      rotate: [-10, 10, -10],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🏖️
                  </motion.div>

                  {/* TÍTULO */}
                  <motion.h2 
                    className="text-3xl md:text-4xl font-black text-center mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #00897B 0%, #26A69A 50%, #4DD0E1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 2px 10px rgba(38, 166, 154, 0.2)',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {modal.title}
                  </motion.h2>

                  {/* LINHA DECORATIVA */}
                  <motion.div 
                    className="flex items-center justify-center gap-2 mb-6"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div 
                      className="h-1 w-12 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #4DD0E1, transparent)'
                      }}
                    ></div>
                    <span className="text-2xl">☀️</span>
                    <div 
                      className="h-1 w-12 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #4DD0E1, transparent)'
                      }}
                    ></div>
                  </motion.div>

                  {/* DESCRIÇÃO */}
                  <motion.div
                    className="text-center leading-relaxed mb-8 text-base md:text-lg"
                    style={{ color: '#37474F' }}
                    dangerouslySetInnerHTML={{
                      __html: modal.description ?? "",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />

                  {/* BOTÕES */}
                  <motion.div 
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {modal.btn1_text && modal.btn1_link && (
                      <motion.a
                        href={modal.btn1_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden w-full py-4 px-6 rounded-2xl font-bold text-lg text-center shadow-lg transform transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #26A69A 0%, #4DD0E1 100%)',
                          color: 'white',
                          width: "80%",
                          margin: "0 auto"
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* EFEITO DE BRILHO */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        
                        <span className="relative flex items-center justify-center gap-2">
                          {modal.btn1_text}
                          <span className="text-xl">→</span>
                        </span>
                      </motion.a>
                    )}

                    {modal.btn2_text && modal.btn2_link && (
                      <motion.a
                        href={modal.btn2_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden w-full py-4 px-6 rounded-2xl font-bold text-lg text-center shadow-lg transform transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
                          color: 'white',
                          width: "70%"
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* EFEITO DE BRILHO */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        
                        <span className="relative flex items-center justify-center gap-2">
                          {modal.btn2_text}
                          <span className="text-xl">→</span>
                        </span>
                      </motion.a>
                    )}
                  </motion.div>

                  {/* EMOJIS DECORATIVOS RODAPÉ */}
                  <motion.div 
                    className="flex justify-center gap-4 mt-6 text-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    >
                      🌊
                    </motion.span>
                    <motion.span
                      animate={{ rotate: [0, -15, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      🌴
                    </motion.span>
                    <motion.span
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    >
                      🍹
                    </motion.span>
                  </motion.div>
                </div>
              </div>

              {/* PARTÍCULAS FLUTUANTES */}
              <motion.div
                className="absolute -top-4 -left-4 text-4xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 text-3xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                🌟
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-2 text-3xl"
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-4 text-4xl"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -15, 0],
                }}
                transition={{ duration: 3.2, repeat: Infinity, delay: 1.2 }}
              >
                💫
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}