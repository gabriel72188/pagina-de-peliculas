// src/utils/serverUtils.js

export const getEmbedUrl = (serverName, movie, season, episode) => {
  const isTv = movie.media_type === 'tv' || movie.first_air_date;
  const tmdbId = movie.id;
  const imdbId = movie.imdb_id;

  // Formato de dos dígitos para cap y temp (aunque la temp no use el cero inicial en Embed69, lo dejamos preparado)
  const safeEpisode = episode.toString().padStart(2, '0');
  const safeSeason = season.toString();

  // 1. Moe
  if (serverName === "Moe") {
    if (!imdbId) return "";
    return `https://xupalace.org/video/${imdbId}-${safeSeason}x${safeEpisode}/`;
  }

  // 2. VidSrc
  if (serverName === "VidSrc") {
    return isTv
      ? `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`
      : `https://vidsrc.xyz/embed/movie/${tmdbId}`;
  }

  // 3. VidSrc 2
  if (serverName === "VidSrc 2") {
    return isTv
      ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${tmdbId}`;
  }

  // 4. Embed69 (Formato corregido: guion, sin cero en temp, barra final)
  if (serverName === "Embed69") {
    if (isTv) {
        return `https://embed69.org/f/${imdbId || tmdbId}-${safeSeason}x${safeEpisode}/`;
    }
    return `https://embed69.org/f/${imdbId || tmdbId}`;
  }

  // 5. SuperEmbed
  if (serverName === "SuperEmbed") {
    return isTv
      ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
      : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
  }

  // 6. SmashyStream
  if (serverName === "Smashy") {
    return isTv
      ? `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`
      : `https://player.smashy.stream/movie/${tmdbId}`;
  }

  return "";
};

// --- AQUÍ ESTÁ EL CAMBIO DE ORDEN ---
export const getServerList = (movie) => {
  if (!movie) return [];
  const isTv = movie.media_type === 'tv' || movie.first_air_date;
  
  // Definimos los servidores secundarios
  const otherServers = ['VidSrc', 'VidSrc 2', 'SuperEmbed', 'Smashy'];

  if (isTv) {
      // Para Series: Embed69 primero, luego Moe (bueno para anime), luego el resto
      return ['Embed69', 'Moe', ...otherServers];
  } else {
      // Para Pelis: Embed69 primero, luego el resto
      return ['Embed69', ...otherServers];
  }
};