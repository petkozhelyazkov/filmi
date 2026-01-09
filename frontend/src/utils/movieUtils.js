export function formatMovieData(movie, isDetail = false) {
  const releaseDate = movie.release_date || movie.first_air_date || ''
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'
  
  let genreText = 'Неизвестен'
  if (movie.genres && movie.genres.length > 0) {
    genreText = movie.genres.map(g => g.name).slice(0, 2).join(', ')
  } else if (movie.genre_ids && movie.genre_ids.length > 0) {
    const genreMap = {
      28: 'Екшън', 12: 'Приключение', 16: 'Анимация', 35: 'Комедия',
      80: 'Криминален', 99: 'Документален', 18: 'Драма', 10751: 'Семеен',
      14: 'Фантастика', 36: 'История', 27: 'Хорър', 10402: 'Музика',
      9648: 'Мистерия', 10749: 'Романтика', 878: 'Научна фантастика',
      53: 'Трилър', 10752: 'Война', 37: 'Уестърн'
    }
    genreText = movie.genre_ids.map(id => genreMap[id] || 'Друго').slice(0, 2).join(', ')
  }
  
  const imageSize = isDetail ? 'w780' : 'w500'
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/${imageSize}${movie.poster_path}` 
    : null
  
  return {
    id: movie.id,
    title: movie.title || movie.name,
    director: movie.director || (movie.created_by && movie.created_by[0]?.name) || 'Неизвестен режисьор',
    description: movie.overview || 'Няма описание',
    year: year,
    genre: genreText,
    type: movie.media_type === 'tv' ? 'Сериал' : 'Филм',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
    duration: movie.runtime 
      ? `${movie.runtime} мин` 
      : movie.number_of_seasons 
        ? `${movie.number_of_seasons} сезона` 
        : 'N/A',
    poster: posterUrl || `https://via.placeholder.com/${isDetail ? '500x750' : '300x450'}?text=${encodeURIComponent(movie.title || movie.name || 'No Image')}`,
    cast: movie.cast || [],
    backdrop: movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
      : null
  }
}

