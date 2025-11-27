import { Calendar, Clock, Car, Users, AlertTriangle, Award } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  shadow: string;
  link: string;
  content: React.ReactNode;
}

export function MenuGrid() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

const menuItems: MenuItem[] = [
    { 
      id: "atividades",
      title: "Atividades", 
      icon: <Calendar className="w-12 h-12" />, 
      color: "bg-gradient-to-br from-[#0D4A5C] to-[#062935]",
      shadow: "shadow-lg",
      content: "Consulte nossa programação completa de atividades para crianças e adolescentes durante as férias!",
      link: "https://fazendadagrama.short.gy/proghome-atividades"
    },
    { 
      id: "horarios",
      title: "Horários", 
      icon: <Clock className="w-12 h-12" />, 
      color: "bg-gradient-to-br from-[#C8D946] to-[#A4B837]",
      shadow: "shadow-lg",
      content: "Confira os horários de funcionamento de todas as áreas de lazer do condomínio.",
      link: "https://fazendadagrama.short.gy/proghome-horarios"
    },
    { 
      id: "transito",
      title: "Trânsito", 
      icon: <Car className="w-12 h-12" />, 
      color: "bg-gradient-to-br from-[#F5A542] to-[#E88B1A]",
      shadow: "shadow-lg",
      content: "Informações sobre trânsito e estacionamento nas áreas comuns.",
      link: "https://fazendadagrama.short.gy/proghome-transito"
    },
    { 
      id: "contatos",
      title: "Contatos", 
      icon: <Users className="w-12 h-12" />, 
      color: "bg-gradient-to-br from-[#5D8456] to-[#3D5D36]",
      shadow: "shadow-lg",
      content: "Lista de contatos importantes do condomínio, incluindo segurança e manutenção.",
      link: "https://fazendadagrama.short.gy/proghome-contatos"
    },

    { 
      id: "detalhes",
      title: "Detalhes (estrutura)", 
      icon: <Award className="w-12 h-12" />, 
      color: "bg-gradient-to-br from-[#0D4A5C] to-[#062935]",
      shadow: "shadow-lg",
      content: "Informações completas sobre a estrutura e infraestrutura do condomínio.",
      link: "https://fazendadagrama.short.gy/proghome-detalhesinfra"
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => setSelectedItem(item)}
            className={`${item.color} text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg hover:shadow-xl`}
          >
            {item.icon}
            <span className="text-center" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>{item.title}</span>
          </button>

          
          
        ))}
        <button
          onClick={() => setShowEmergency(true)}
          className="w-full bg-gradient-to-br from-[#F85C5C] to-[#E63939] hover:from-[#F74444] hover:to-[#D82929] text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg hover:shadow-xl"
        >
          <AlertTriangle className="w-8 h-8" />
          <span className="text-center" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Manual de Emergência</span>
        </button>        
      </div>
      


      <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              {selectedItem?.icon}
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p>{selectedItem?.content}</p>
            {selectedItem?.link && (
              <a
                href={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-br from-[#0D4A5C] to-[#062935] hover:from-[#0A3A4A] hover:to-[#041D26] text-white rounded-lg py-3 px-4 text-center transition-all transform active:scale-95 shadow-md hover:shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
              >
                Ver {selectedItem.title}
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmergency} onOpenChange={() => setShowEmergency(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              <AlertTriangle className="w-8 h-8" />
              Manual de Emergência
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-600 mb-2">Em caso de incêndio:</h3>
                <p>1. Mantenha a calma</p>
                <p>2. Ligue 193 (Bombeiros)</p>
                <p>3. Avise a segurança do condomínio</p>
                <p>4. Evacue o local com segurança</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-600 mb-2">Em caso de acidente:</h3>
                <p>1. Ligue 192 (SAMU)</p>
                <p>2. Avise o Concierge imediatamente</p>
                <p>3. Não mova a vítima</p>
                <p>4. Aguarde o socorro</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-yellow-600 mb-2">Pontos de encontro:</h3>
                <p>• Área verde próxima à portaria</p>
                <p>• Campo de golfe (área aberta)</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}