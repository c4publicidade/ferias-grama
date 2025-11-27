import { Sun, Cloud, Wind, Droplets } from "lucide-react";

export function WeatherWidget() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-3">
      <h2 className="text-center text-white mb-2 drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>Previsão do Tempo</h2>
      
      {/* Main weather - centered horizontal layout */}
      <div className="flex flex-col items-center justify-center mb-2 pb-2 border-b border-white/30">
        <div className="flex items-center gap-3 mb-1">
          <Sun className="w-8 h-8 text-yellow-300" />
          <p className="text-3xl text-white drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>30°</p>
        </div>
        <p className="text-xs text-white drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>HOJE - SOL ENTRE NUVENS</p>
      </div>

      {/* Bottom info - horizontal layout */}
      <div className="grid grid-cols-3 gap-2">
        {/* Amanhã */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-white mb-1 drop-shadow" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Amanhã</p>
          <div className="flex items-center gap-1">
            <Cloud className="w-4 h-4 text-white" />
            <p className="text-lg text-white drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>27°</p>
          </div>
        </div>

        {/* Vento */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-white mb-1 drop-shadow" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Vento</p>
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4 text-white" />
            <p className="text-lg text-white drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>13km</p>
          </div>
        </div>

        {/* Umidade */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-white mb-1 drop-shadow" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Umidade</p>
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-white" />
            <p className="text-lg text-white drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>90%</p>
          </div>
        </div>
      </div>
    </div>
  );
}