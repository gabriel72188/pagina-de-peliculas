// src/pages/TvShowHubPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w300";
const EPISODES_PER_PAGE = 12;

const TvShowHubPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [show, setShow] = useState(null);
    const [season, setSeason] = useState(1);
    const [seasonsList, setSeasonsList] = useState([]);
    const [episodesList, setEpisodesList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    // 1. Cargar detalles de la serie
    useEffect(() => {
        setLoadingDetails(true);
        const fetchShowDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=es-ES`);
                const data = await res.json();
                setShow(data);

                if (data.seasons) {
                    // Filtrar temporadas especiales (número 0)
                    const cleanSeasons = data.seasons.filter(s => s.season_number > 0);
                    setSeasonsList(cleanSeasons);
                    if (cleanSeasons.length > 0) {
                        setSeason(cleanSeasons[0].season_number);
                    }
                }
            } catch (e) {
                console.error("Error fetching show details:", e);
            }
            setLoadingDetails(false);
        };
        fetchShowDetails();
    }, [id]);

    // 2. Cargar episodios de la temporada seleccionada
    useEffect(() => {
        if (!show) return;
        setLoadingEpisodes(true);
        const fetchEpisodes = async () => {
            try {
                const res = await fetch(`${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}&language=es-ES`);
                const data = await res.json();
                setEpisodesList(data.episodes || []);
                setCurrentPage(1); // Resetear a la primera página de episodios
            } catch (e) {
                console.error("Error fetching episodes:", e);
            }
            setLoadingEpisodes(false);
        };
        fetchEpisodes();
    }, [id, season, show]);

    if (loadingDetails) return <div className="text-white pt-24 text-center">Cargando detalles de la serie...</div>;
    if (!show) return <div className="text-white pt-24 text-center">Serie no encontrada.</div>;

    // Paginación de episodios
    const totalEpisodes = episodesList.length;
    const totalPages = Math.ceil(totalEpisodes / EPISODES_PER_PAGE);
    
    // Obtener los episodios de la página actual
    const indexOfLastEpisode = currentPage * EPISODES_PER_PAGE;
    const indexOfFirstEpisode = indexOfLastEpisode - EPISODES_PER_PAGE;
    const currentEpisodes = episodesList.slice(indexOfFirstEpisode, indexOfLastEpisode);

    return (
        <div className="min-h-screen bg-[#141414] text-white pt-[70px] pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
                
                {/* DETALLES Y TITULO DE LA SERIE */}
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{show.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                    <span className="text-green-500 font-bold">{(show.vote_average * 10).toFixed(0)}% Nota</span>
                    <span>{show.first_air_date?.split('-')[0]}</span>
                    <span>{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Temporada' : 'Temporadas'}</span>
                </div>

                {/* SINOPSIS Y POSTER */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start text-center md:text-left">
                    <img src={show.poster_path ? `${SMALL_IMAGE_URL}${show.poster_path}` : ''} alt="poster" className="w-40 md:w-48 rounded-lg shadow-lg flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold mb-2">Sinopsis</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{show.overview || "Sin descripción disponible."}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {show.genres?.map(g => (
                                <span key={g.id} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SELECTOR DE TEMPORADAS */}
                <div className="bg-[#1f1f1f] p-4 rounded-xl mb-8 border border-gray-800 text-left">
                    <div className="flex items-center gap-4">
                        <label className="text-gray-300 text-sm font-bold">Seleccionar Temporada:</label>
                        <select
                            value={season} 
                            onChange={(e) => setSeason(Number(e.target.value))}
                            className="bg-[#2a2a2a] border border-gray-700 text-white rounded px-3 py-1.5 outline-none font-bold cursor-pointer transition hover:border-gray-500"
                        >
                            {seasonsList.map(s => (
                                <option key={s.id} value={s.season_number}>
                                    Temp. {s.season_number} ({s.episode_count} cap.)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* CUADRÍCULA DE EPISODIOS */}
                {loadingEpisodes ? (
                    <div className="text-center py-10 text-gray-400">Cargando episodios...</div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
                            Episodios - Temporada {season}
                        </h2>

                        {episodesList.length === 0 ? (
                            <div className="text-gray-400 text-center py-6">No hay episodios disponibles para esta temporada.</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {currentEpisodes.map(ep => (
                                        <div 
                                            key={ep.id} 
                                            onClick={() => navigate(`/ver/tv/${id}/temporada/${season}/capitulo/${ep.episode_number}`)} 
                                            className="flex gap-3 p-3 rounded-lg cursor-pointer transition group bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-transparent hover:border-gray-800"
                                        >
                                            <div className="relative w-32 aspect-video rounded overflow-hidden flex-shrink-0 bg-gray-800">
                                                {ep.still_path ? (
                                                    <img src={`${SMALL_IMAGE_URL}${ep.still_path}`} alt={ep.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center text-xs text-gray-500">Sin Imagen</div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden text-left">
                                                <h4 className="font-bold truncate text-sm">
                                                    <span className="text-blue-400">{ep.episode_number}.</span> {ep.name}
                                                </h4>
                                                <p className="text-gray-400 text-xs line-clamp-2 mt-1">{ep.overview || "Sin descripción disponible."}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* PAGINACIÓN */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
                                        >
                                            ◀ Anterior
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
                                        >
                                            Siguiente ▶
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default TvShowHubPage;
