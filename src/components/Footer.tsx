import { Phone } from "lucide-react";
import grammaLogo from "../assets/logo.webp";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-500 to-teal-700 text-white py-8 px-4 text-center relative z-30">
      <p className="mb-4 drop-shadow-md text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Em caso de dúvidas, entre em contato com o Concierge:</p>
      <div className="flex items-center justify-center gap-2 mb-4 bg-white/20 rounded-full py-3 px-5 max-w-xs mx-auto">
        <Phone className="w-4 h-4" />
        <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>11 4591-8000 / ramal 8000</p>
      </div>
      <div className="mb-2 flex items-center justify-center mx-auto">
        <img src={grammaLogo} alt="Fazenda da Grama" className="h-12 object-contain" />
      </div>
    </footer>
  );
}