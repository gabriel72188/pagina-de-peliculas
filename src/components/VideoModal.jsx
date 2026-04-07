import React, { useState, useEffect } from 'react';
import { getEmbedUrl, getServerList } from '../utils/serverUtils';

// Ahora recibe 'initialSeason' e 'initialEpisode' desde fuera
const VideoModal = ({ movie, onClose, apiKey, baseUrl, initialSeason = 1, initialEpisode = 1 }) => {
  // Mantenemos estado interno solo para el botón "Siguiente Capítulo"
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [server, setServer] = useState("");
  const [movieWithImdb, setMovieWithImdb] = useState(movie);

  useEffect(() => {
    const init = async () => {
        const isTv = movie.media_type === 'tv' || movie.first_air_date;
        setServer(isTv ? "Moe" : "Embed69"); // Servidores por defecto

        if (!movie.imdb_id) {
            try {
                const type = isTv ? 'tv' : 'movie';
                const res = await fetch(`${baseUrl}/${type}/${movie.id}/external_ids?api_key=${apiKey}`);
                const data = await res.json();
                if (data.imdb_id) setMovieWithImdb({ ...movie, imdb_id: data.imdb_id });
            } catch (e) { console.error(e); }
        }
    };
    init();
    // Reseteamos si cambian las props
    setSeason(initialSeason);
    setEpisode(initialEpisode);
  }, [movie, initialSeason, initialEpisode, apiKey, baseUrl]);

  const isTv = movieWithImdb.media_type === 'tv' || movieWithImdb.first_air_date;
  const servers = getServerList(movieWithImdb);

  return (
    // Z-index alto (60) para estar encima del menú de detalles
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      
      {/* Botón Cerrar Player */}
       <button onClick={onClose} className="absolute top-4 right-4 text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 transition z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
       </button>

      {/* Iframe */}
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-gray-800">
         <iframe
            key={`${server}-${season}-${episode}`}
            src={getEmbedUrl(server, movieWithImdb, season, episode)}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
         ></iframe>
      </div>

      {/* Control simple para siguiente capítulo */}
      {isTv && (
        <div className="mt-4 flex items-center gap-4 bg-[#1e293b] p-3 rounded-lg border border-gray-700 shadow-lg relative z-10">
            <span className="text-white font-bold">
                T{season} : E{episode}
            </span>
            <button
                onClick={() => setEpisode(Number(episode) + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
            >
                Siguiente Cap ▶
            </button>
        </div>
      )}

      {/* Selectores de Servidor */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center relative z-10">
        {servers.map((srvName) => (
            <button
                key={srvName}
                onClick={() => setServer(srvName)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition border ${
                    server === srvName
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-gray-300 border-gray-600 hover:border-white hover:text-white'
                }`}
            >
                {srvName}
            </button>
        ))}
      </div>
    </div>
  );
};

export default VideoModal;