// src/pages/WatchSeriePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmbedUrl, getServerList } from '../utils/serverUtils';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

const WatchSeriePage = () => {
    const { id, season, episode } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [episodesList, setEpisodesList] = useState([]);
    const [episodeDetails, setEpisodeDetails] = useState(null);
    const [server, setServer] = useState("");
    const [loading, setLoading] = useState(true);

    const currentEpNum = Number(episode);
    const currentSeasonNum = Number(season);

    // 1. Cargar detalles del show y de la temporada
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch Show details with external ids for IMDB
                const showRes = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=external_ids`);
                const showData = await showRes.json();
                
                showData.media_type = 'tv';
                if (showData.external_ids && showData.external_ids.imdb_id) {
                    showData.imdb_id = showData.external_ids.imdb_id;
                }
                setShow(showData);

                // Configurar servidor por defecto si aún no está seleccionado
                const serverList = getServerList(showData);
                if (serverList.length > 0 && !server) {
                    setServer(serverList[0]);
                }

                // Fetch Season details
                const seasonRes = await fetch(`${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}&language=es-ES`);
                const seasonData = await seasonRes.json();
                const episodes = seasonData.episodes || [];
                setEpisodesList(episodes);

                // Encontrar el episodio actual
                const currEp = episodes.find(e => e.episode_number === currentEpNum);
                setEpisodeDetails(currEp || null);

            } catch (e) {
                console.error("Error loading show/season details:", e);
            }
            setLoading(false);
        };

        fetchAllData();
    }, [id, season, episode, currentEpNum]);

    if (loading) return <div className="text-white pt-24 text-center">Cargando episodio...</div>;
    if (!show || !episodeDetails) return <div className="text-white pt-24 text-center">Episodio no encontrado.</div>;

    const servers = getServerList(show);

    // Encontrar índices de episodios para la navegación
    const currentIndex = episodesList.findIndex(e => e.episode_number === currentEpNum);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < episodesList.length - 1;

    const handlePrev = () => {
        if (hasPrev) {
            const prevEpNum = episodesList[currentIndex - 1].episode_number;
            navigate(`/ver/tv/${id}/temporada/${season}/capitulo/${prevEpNum}`);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            const nextEpNum = episodesList[currentIndex + 1].episode_number;
            navigate(`/ver/tv/${id}/temporada/${season}/capitulo/${nextEpNum}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white pt-[70px] pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
                
                {/* DETALLES Y TITULO DEL EPISODIO */}
                <h1 className="text-3xl font-bold mb-1 text-left">{show.name}</h1>
                <h2 className="text-xl text-blue-400 mb-6 text-left">
                    Temporada {season}, Capítulo {episode}: {episodeDetails.name}
                </h2>

                {/* SINOPSIS Y MINIATURA DEL EPISODIO */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start text-center md:text-left">
                    <img 
                        src={episodeDetails.still_path ? `${SMALL_IMAGE_URL}${episodeDetails.still_path}` : (show.poster_path ? `${SMALL_IMAGE_URL}${show.poster_path}` : '')} 
                        alt="capitulo" 
                        className="w-56 rounded-lg shadow-lg flex-shrink-0 object-cover aspect-video bg-gray-800" 
                    />
                    <div>
                        <h3 className="text-xl font-bold mb-2">Sinopsis del Capítulo</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{episodeDetails.overview || "Sin descripción disponible para este capítulo."}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {show.genres?.map(g => (
                                <span key={g.id} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTONES DE NAVEGACIÓN */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 mb-6 w-full">
                    {hasPrev && (
                        <button
                            onClick={handlePrev}
                            className="w-full md:w-auto text-center px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md"
                        >
                            Cap. Anterior
                        </button>
                    )}

                    <button
                        onClick={() => navigate(`/ver/tv/${id}`)}
                        className="w-full md:w-auto text-center px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md"
                    >
                        Todos los Capítulos
                    </button>

                    {hasNext && (
                        <button
                            onClick={handleNext}
                            className="w-full md:w-auto text-center px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md"
                        >
                            Cap. Siguiente
                        </button>
                    )}
                </div>

                {/* SELECTOR DE SERVIDORES */}
                <div className="bg-[#1f1f1f] p-4 rounded-xl mb-8 border border-gray-800 text-left">
                    <h3 className="text-gray-400 text-sm mb-2 font-bold uppercase">Servidor:</h3>
                    <div className="flex flex-wrap gap-2">
                        {servers.map((srvName) => (
                            <button
                                key={srvName}
                                onClick={() => setServer(srvName)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition ${server === srvName
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                                    }`}
                            >
                                {srvName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* REPRODUCTOR */}
                <div className="w-full aspect-video bg-black relative shadow-2xl rounded-xl overflow-hidden mb-8 border border-gray-800">
                    <iframe
                        key={`${server}-${season}-${episode}`}
                        src={getEmbedUrl(server, show, currentSeasonNum, currentEpNum)}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                    ></iframe>
                </div>

            </div>
        </div>
    );
};

export default WatchSeriePage;
