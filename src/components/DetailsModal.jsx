import React, { useState, useEffect } from 'react';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

const DetailsModal = ({ movie, onClose, onPlay, apiKey, baseUrl }) => {
  const [isTv, setIsTv] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // 1. Detectar si es TV y cargar info básica de temporadas
  useEffect(() => {
    if (!movie) return;
    const checkTv = movie.media_type === 'tv' || movie.first_air_date;
    setIsTv(checkTv);

    if (checkTv) {
      const fetchTvDetails = async () => {
        try {
          // Pedimos detalles para saber cuántas temporadas hay
          const res = await fetch(`${baseUrl}/tv/${movie.id}?api_key=${apiKey}&language=es-ES`);
          const data = await res.json();
          setSeasons(data.seasons || []);
          // Seleccionar la primera temporada real (evitar temporada 0/especiales si se puede)
          const firstSeason = data.seasons.find(s => s.season_number > 0) || data.seasons[0];
          if (firstSeason) setSelectedSeason(firstSeason.season_number);
        } catch (e) { console.error("Error cargando detalles TV:", e); }
      };
      fetchTvDetails();
    }
  }, [movie, apiKey, baseUrl]);

  // 2. Cargar episodios cuando cambia la temporada seleccionada
  useEffect(() => {
    if (isTv && selectedSeason) {
      const fetchSeasonEpisodes = async () => {
        setLoadingEpisodes(true);
        try {
          const res = await fetch(`${baseUrl}/tv/${movie.id}/season/${selectedSeason}?api_key=${apiKey}&language=es-ES`);
          const data = await res.json();
          setSeasonEpisodes(data.episodes || []);
        } catch (e) { console.error("Error cargando episodios:", e); }
        setLoadingEpisodes(false);
      };
      fetchSeasonEpisodes();
    }
  }, [isTv, selectedSeason, movie, apiKey, baseUrl]);

  // Función para iniciar reproducción
  const handlePlayClick = (s = 1, e = 1) => {
    // Avisamos a App.jsx que queremos reproducir ESTE cap concreto
    onPlay({ movie, season: s, episode: e });
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center items-start pt-4 md:pt-10 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-[#141414] w-full max-w-5xl rounded-xl overflow-hidden relative shadow-2xl mb-10 mx-2 md:mx-0 border border-gray-800">
        
        {/* Botón Cerrar (X) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-30 bg-black/50 p-2 rounded-full text-white hover:bg-red-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* --- CABECERA (Imagen Gigante) --- */}
        <div className="relative aspect-video md:aspect-[21/9]">
          <img
            src={movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : ''}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Degradado para el texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              {movie.title || movie.name}
            </h1>
             <div className="flex items-center gap-4 mb-6 text-sm font-semibold text-gray-300">
                 <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Coincidencia</span>
                 <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                 <span className="border border-gray-500 px-2 py-0.5 rounded text-xs">HD</span>
            </div>
            
            {/* Botón Play Principal */}
            <button 
                onClick={() => handlePlayClick(isTv ? selectedSeason : 1, isTv ? (seasonEpisodes[0]?.episode_number || 1) : 1)}
                className="bg-white text-black font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-gray-200 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              {isTv ? 'Reproducir T1 E1' : 'Reproducir Película'}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12">
            {/* Sinopsis */}
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
                {movie.overview}
            </p>

            {/* --- SECCIÓN DE EPISODIOS (Solo si es Serie) --- */}
            {isTv && (
                <div>
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold">Episodios</h2>
                        {/* Selector de Temporada */}
                        <select 
                            value={selectedSeason} 
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            className="bg-[#2a2a2a] text-white border border-gray-700 rounded px-4 py-2 outline-none focus:border-blue-500 font-bold"
                        >
                            {seasons.map(s => (
                                <option key={s.id} value={s.season_number}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lista Visual de Episodios */}
                    <div className="space-y-4">
                        {loadingEpisodes ? (
                            <div className="text-gray-400 text-center py-10 animate-pulse">Cargando episodios...</div>
                        ) : (
                            seasonEpisodes.map(ep => (
                                <div 
                                    key={ep.id}
                                    onClick={() => handlePlayClick(selectedSeason, ep.episode_number)}
                                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-[#1f1f1f] rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition group border border-transparent hover:border-gray-700"
                                >
                                    {/* Miniatura del Episodio */}
                                    <div className="relative w-full md:w-64 aspect-video rounded overflow-hidden flex-shrink-0">
                                        <img 
                                            src={ep.still_path ? `${SMALL_IMAGE_URL}${ep.still_path}` : 'https://via.placeholder.com/300x170?text=Sin+Imagen'} 
                                            alt={ep.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        {/* Icono Play al pasar el ratón */}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <svg className="w-12 h-12 text-white bg-black/50 rounded-full p-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                    
                                    {/* Info del Episodio */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
                                            <span className="text-blue-400">{ep.episode_number}.</span> {ep.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 leading-snug">{ep.overview || "Sin descripción disponible."}</p>
                                    </div>
                                    <div className="text-gray-500 text-sm font-medium hidden md:block">
                                        {ep.runtime ? `${ep.runtime} min` : ''}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;