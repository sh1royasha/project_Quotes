import { useState, useEffect, useRef } from "react";
import "./App.css";
import { frases } from "./data/frases";


function App() {
 
  const [started, setStarted] = useState(false);
  const [frase, setFrase] = useState("");
  const [decoracion, setDecoracion] = useState(null);

  const clickSound = useRef(null);
  const regaloSound = useRef(null);

  const decoraciones = ["/salchicha1.JPG", "/salchicha2.JPG"];

  const getTodayKey = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const playSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const todayKey = getTodayKey();
    const savedData = localStorage.getItem("fraseDia");

    if (savedData) {
      const { date, frase } = JSON.parse(savedData);
      if (date === todayKey) {
        setFrase(frase);
        setStarted(true);
        const randomDeco =
          decoraciones[Math.floor(Math.random() * decoraciones.length)];
        setDecoracion(randomDeco);
      }
    }
  }, []);

  const nuevaFrase = () => {
  const todayKey = getTodayKey();
  const usadas = JSON.parse(localStorage.getItem("frasesUsadas")) || [];


  const disponibles = frases.filter(f => !usadas.includes(f));

 
  const pool = disponibles.length > 0 ? disponibles : frases;

  const randomFrase = pool[Math.floor(Math.random() * pool.length)];
  const randomDeco =
    decoraciones[Math.floor(Math.random() * decoraciones.length)];

  setFrase(randomFrase);
  setDecoracion(randomDeco);

  localStorage.setItem(
    "fraseDia",
    JSON.stringify({ date: todayKey, frase: randomFrase })
  );


  const nuevoHistorial = usadas.includes(randomFrase)
    ? usadas
    : [...usadas, randomFrase];
  localStorage.setItem("frasesUsadas", JSON.stringify(nuevoHistorial));

  playSound(regaloSound);
};

  const handleStart = () => {
    playSound(clickSound);

    if (frase) {
      setStarted(true);
      return;
    }

    setStarted(true);
    nuevaFrase();
  };

  return (
    <div className="app">
      {/* sonidos */}
      <audio ref={clickSound} src="/click.mp3" preload="auto"></audio>
      <audio ref={regaloSound} src="/regalo.mp3" preload="auto"></audio>

      {!started ? (
        <div className="start-screen">
          <h1>🌸 Brisa Azul 🌸</h1>
          <p>✨ Presiona Start para recibir tu frase del día ✨</p>
          <button className="start-btn" onClick={handleStart}>
            ▶ START
          </button>
        </div>
      ) : (
        <div className="game-container fade-in">
          {decoracion && (
            <img
              src={decoracion}
              alt="Decoración"
              className="decoracion-flotante"
            />
          )}
          <h2>✨ Frase del día ✨</h2>
          <div className="text-box">
            <p>{frase}</p>
          </div>
          <p className="hint">(Vuelve mañana para una nueva)</p>
        </div>
      )}

      <div className="tulip-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src={`/tulip${(i % 5) + 1}.svg`}
            alt={`Tulipán ${i + 1}`}
            className={`tulip tulip-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
