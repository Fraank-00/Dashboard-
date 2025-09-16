import { useState, useEffect } from "react";
import LineChartComponent from "./components/LineChartComponent";
import WeatherChart from "./components/WeatherChart";
import FinanceChart from "./components/FinanceChart";
import CovidChart from "./components/CovidChart";
import { dataFinanzas, dataCovid } from "./dataSets";

export default function App() {
  const [categoria, setCategoria] = useState("clima");
  const [climaData, setClimaData] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (categoria === "clima") {
      setLoading(true);
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Buenos%20Aires&units=metric&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.list) return;

          // Agrupamos por día
          const agrupado = {};
          data.list.forEach((item) => {
            const fecha = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
            if (!agrupado[fecha]) agrupado[fecha] = [];
            agrupado[fecha].push(item.main.temp);
          });

          // Promedio de cada día
          const datosTransformados = Object.entries(agrupado).map(
            ([fecha, temps]) => ({
              name: fecha,
              valor: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(
                1
              ),
            })
          );

          setClimaData(datosTransformados);
          setLoading(false);
        });
    }
  }, [categoria, API_KEY]);

  const obtenerDatos = () => {
    switch (categoria) {
      case "finanzas":
        return { titulo: "Finanzas", data: dataFinanzas };
      case "covid":
        return { titulo: "COVID-19", data: dataCovid };
      default:
        return { titulo: "Clima", data: climaData };
    }
  };

  const { titulo, data } = obtenerDatos();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setCategoria("clima")}
            className="hover:bg-blue-700 p-2 rounded"
          >
            Clima
          </button>
          <button
            onClick={() => setCategoria("finanzas")}
            className="hover:bg-blue-700 p-2 rounded"
          >
            Finanzas
          </button>
          <button
            onClick={() => setCategoria("covid")}
            className="hover:bg-blue-700 p-2 rounded"
          >
            COVID
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard de Estadísticas
          </h1>
        </header>

        <section>
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">{titulo}</h2>
              {categoria === "clima" ? (
                <WeatherChart data={climaData} />
              ) : categoria === "finanzas" ? (
                <FinanceChart data={data} />
              ) : (
                <CovidChart data={data} />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
