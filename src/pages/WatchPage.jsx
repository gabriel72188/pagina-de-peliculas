// src/pages/WatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmbedUrl, getServerList } from '../utils/serverUtils';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

const WatchPage = () => {
    const { type, id } = useParams();
    const [movie, setMovie] = useState(null);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [server, setServer] = useState("");
    const [seasonsList, setSeasonsList] = useState([]);
    const [episodesList, setEpisodesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const isTv = type === 'tv';

    // 1. Cargar detalles
    useEffect(() => {
        setLoading(true);
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=external_ids`);
                const data = await res.json();

                // Arreglos de IDs y tipo
                data.media_type = type;
                if (data.external_ids && data.external_ids.imdb_id) {
                    data.imdb_id = data.external_ids.imdb_id;
                }

                setMovie(data);

                // --- CAMBIO AQUÍ: Configurar servidor por defecto DINÁMICAMENTE ---
                const serverList = getServerList(data);
                if (serverList.length > 0) {
                    setServer(serverList[0]); // Selecciona siempre el primero de la lista
                }

                // Preparar temporadas si es serie
                if (isTv && data.seasons) {
                    setSeasonsList(data.seasons.filter(s => s.season_number > 0));
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };

        fetchDetails();
        setSeason(1);
        setEpisode(1);
    }, [type, id, isTv]);

    // 2. Cargar episodios
    useEffect(() => {
        if (isTv && movie) {
            const fetchEpisodes = async () => {
                try {
                    const res = await fetch(`${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}&language=es-ES`);
                    const data = await res.json();
                    setEpisodesList(data.episodes || []);
                } catch (e) { console.error(e); }
            };
            fetchEpisodes();
        }
    }, [isTv, id, season, movie]);


    if (loading) return <div className="text-white pt-24 text-center">Cargando...</div>;
    if (!movie) return <div className="text-white pt-24 text-center">No encontrado.</div>;

    const servers = getServerList(movie);

    return (
        <div className="min-h-screen bg-[#141414] text-white pt-[70px] pb-20">

            {/* REPRODUCTOR */}
            <div className="w-full aspect-video bg-black relative shadow-xl">
                <iframe
                    key={`${server}-${season}-${episode}`}
                    src={getEmbedUrl(server, movie, season, episode)}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                ></iframe>
            </div>

            {/* DETALLES */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{movie.title || movie.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                    <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Nota</span>
                    <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                    {movie.runtime && <span>{movie.runtime} min</span>}
                    {movie.number_of_seasons && <span>{movie.number_of_seasons} Temporadas</span>}
                </div>

                {/* CONTROLES */}
                <div className="bg-[#1f1f1f] p-4 rounded-xl mb-8 border border-gray-800">
                    <div className="mb-4">
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

                    {isTv && (
                        <div className="flex flex-wrap items-center gap-4 border-t border-gray-800 pt-4">
                            <div>
                                <label className="text-gray-400 text-sm font-bold mr-2">Temporada:</label>
                                <select
                                    value={season} onChange={(e) => setSeason(Number(e.target.value))}
                                    className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-1 outline-none font-bold"
                                >
                                    {seasonsList.map(s => <option key={s.id} value={s.season_number}>Temp. {s.season_number}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm font-bold mr-2">Capítulo:</label>
                                <input
                                    type="number" min="1" value={episode}
                                    onChange={(e) => setEpisode(Number(e.target.value))}
                                    className="w-16 bg-[#2a2a2a] border border-gray-700 rounded px-3 py-1 text-center outline-none font-bold"
                                />
                            </div>
                            <button onClick={() => setEpisode(e => e + 1)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-bold ml-auto">
                                Siguiente Cap ▶
                            </button>
                        </div>
                    )}
                </div>

                {/* SINOPSIS */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <img src={movie.poster_path ? `${SMALL_IMAGE_URL}${movie.poster_path}` : ''} alt="poster" className="w-32 md:w-48 rounded-lg shadow-lg hidden md:block" />
                    <div>
                        <h3 className="text-xl font-bold mb-2">Sinopsis</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{movie.overview || "Sin descripción disponible."}</p>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres?.map(g => (<span key={g.id} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">{g.name}</span>))}
                        </div>
                    </div>
                </div>

                {/* LISTA EPISODIOS */}
                {isTv && episodesList.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">Episodios - Temporada {season}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {episodesList.map(ep => (
                                <div key={ep.id} onClick={() => setEpisode(ep.episode_number)} className={`flex gap-3 p-3 rounded-lg cursor-pointer transition group ${ep.episode_number === episode ? 'bg-blue-900/30 border border-blue-500' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a]'}`}>
                                    <div className="relative w-32 aspect-video rounded overflow-hidden flex-shrink-0 bg-gray-800">
                                        {ep.still_path && <img src={`${SMALL_IMAGE_URL}${ep.still_path}`} alt={ep.name} className="w-full h-full object-cover" />}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100"><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold truncate text-sm"><span className="text-blue-400">{ep.episode_number}.</span> {ep.name}</h4>
                                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">{ep.overview}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchPage;