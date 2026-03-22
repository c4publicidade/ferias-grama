import { Sun, Cloud, Wind, Droplets } from "lucide-react";
import { useEffect, useState } from "react";

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [tomorrow, setTomorrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Itupeva");

  const API_KEY = "ba8dcc66aa29776dc4b4df2f7a5c8f06";

  async function fetchWeather(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("API retornou erro: " + res.status);

      const data = await res.json();
      setWeather(data);
      setCity("Itupeva");
    } catch (error) {
      console.error("Erro ao buscar clima:", error);
      setWeather(null);
      setCity("Indisponível");
    }
  }

  async function fetchTomorrow(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("Erro na previsão: " + res.status);

      const data = await res.json();

      // Dia de amanhã yyyy-mm-dd
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const yyyy = tomorrowDate.getFullYear();
      const mm = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrowDate.getDate()).padStart(2, "0");
      const targetDay = `${yyyy}-${mm}-${dd}`;

      // Filtrar todos os horários de amanhã
      const tomorrowList = data.list.filter((item: any) =>
        item.dt_txt.startsWith(targetDay)
      );

      if (tomorrowList.length > 0) {
        const temps = tomorrowList.map((t: any) => t.main.temp);
        const temps_min = tomorrowList.map((t: any) => t.main.temp_min);
        const temps_max = tomorrowList.map((t: any) => t.main.temp_max);

        // Ícone do horário do meio-dia OU primeiro horário disponível
        const noonData =
          tomorrowList.find((item: any) =>
            item.dt_txt.endsWith("12:00:00")
          ) || tomorrowList[0];

        setTomorrow({
          temp: Math.round(noonData.main.temp),
          temp_min: Math.round(Math.min(...temps_min)),
          temp_max: Math.round(Math.max(...temps_max)),
          description: noonData.weather?.[0]?.description?.toUpperCase() || "",
          icon: noonData.weather?.[0]?.icon || "01d",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar previsão de amanhã:", error);
      setTomorrow(null);
    } finally {
      setLoading(false);
    }
  }


  // 🔥 Sempre usa Itupeva-SP como padrão
  useEffect(() => {
    const lat = -23.1526;  // Itupeva - SP
    const lon = -47.0593;  // Itupeva - SP

    async function load() {
      await fetchWeather(lat, lon);
      await fetchTomorrow(lat, lon);
      setCity("Itupeva");
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center text-white">
        Carregando previsão...
      </div>
    );
  }

  if (!weather || !weather.main) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center text-white">
        Não foi possível carregar os dados do clima.
      </div>
    );
  }

  const temp = Math.round(weather.main.temp);
  const humidity = weather.main.humidity;
  const wind = Math.round(weather.wind.speed * 3.6);
  const description = weather.weather?.[0]?.description?.toUpperCase() ?? "";

  return (
 <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-3"
      
 >

    {/* Título */}
    <h2
      className="text-center text-white mb-2 drop-shadow-lg text-sm sm:text-base"
      style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
    >
      Previsão do Tempo
    </h2>

    {/* Hoje */}
    <div className="flex flex-col items-center justify-center mb-2 pb-2 border-b border-white/30">
      <div className="flex items-center gap-2 mb-1">
        <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />

        <p
          className="text-2xl sm:text-3xl text-white drop-shadow-lg"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
        >
          {temp}°
        </p>
      </div>

      <p
        className="text-[10px] sm:text-xs text-white drop-shadow-md text-center"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        HOJE – {description}
      </p>
    </div>

    {/* Grid reduzido no mobile */}
    <div   style={{
    display: "flex",
    justifyContent: "center",
    gap: "50px",
  }} >

      {/* AMANHÃ */}
      <div className="flex flex-col items-center">
        <p className="text-[9px] sm:text-[10px] text-white mb-1 drop-shadow">
          Amanhã
        </p>

        {tomorrow ? (
          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${tomorrow.icon}.png`}
              alt="icone"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />

            <p className="text-sm sm:text-base text-white drop-shadow-md">
              {tomorrow.temp}°
            </p>

          {/*  <p style={{ fontSize: "14px" }}  className="text-[14px] text-white drop-shadow text-center leading-tight">
              {tomorrow.description}
            </p>*/}

                     
          </div>
        ) : (
          <p className="text-sm sm:text-base text-white">--°</p>
        )}
      </div>

      {/* VENTO */}
      <div className="flex flex-col items-center">
        <p className="text-[9px] sm:text-xs text-white mb-1 drop-shadow">
          Vento
        </p>

        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          <p className="text-sm sm:text-lg text-white drop-shadow-md">
            {wind} km/h
          </p>
        </div>
      </div>

      {/* UMIDADE */}
      <div className="flex flex-col items-center">
        <p className="text-[9px] sm:text-xs text-white mb-1 drop-shadow">
          Umidade
        </p>

        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          <p className="text-sm sm:text-lg text-white drop-shadow-md">
            {humidity}%
          </p>
        </div>
      </div>

    </div>
  </div>

  );
}
