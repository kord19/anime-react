import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AnimeList.css'; // Adicione um arquivo CSS para estilizar

function AnimeList() {
  const [page, setPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [letterFilter, setLetterFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/genres/anime');
      setGenres(response.data.data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchAnimeList = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.jikan.moe/v4/seasons/now', {
        params: {
          page,
        },
      });

      const { data } = response;
      setAnimeList((prevList) => [...prevList, ...data.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeList();
    fetchGenres();
  }, [page]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    setAnimeList([]);

    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          q: searchQuery,
          page,
        },
      });

      const { data } = response;
      setAnimeList(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = async (letter) => {
    setLoading(true);
    setError(null);
    setLetterFilter(letter);
    setPage(1);
    setAnimeList([]);

    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          q: letter,
          page,
        },
      });

      const { data } = response;
      setAnimeList(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = async (event) => {
    setLoading(true);
    setError(null);
    setGenreFilter(event.target.value);
    setPage(1);
    setAnimeList([]);

    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          genres: event.target.value,
          page,
        },
      });

      const { data } = response;
      setAnimeList(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLetterFilter('');
    setGenreFilter('');
    setPage(1);
    setAnimeList([]);
    fetchAnimeList();
  };

  return (
    <div className="main-content">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for an anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-icon" onClick={handleSearch}>🔍</button>
        <button className="clear-filters" onClick={clearFilters}>❌ Clear Filters</button>
      </div>
      <div className="letter-buttons">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <button key={letter} onClick={() => handleLetterClick(letter)}>
            {letter}
          </button>
        ))}
      </div>
      <div className="genre-filter">
        <select value={genreFilter} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.mal_id} value={genre.mal_id}>{genre.name}</option>
          ))}
        </select>
      </div>
      <div className="anime-list">
        {['Action', 'Adventure', 'Comedy'].map((category) => (
          <div key={category}>
            <h2>{category} Anime</h2>
            <div className="anime-list-section">
              {animeList
                .filter((anime) => anime.genres.some((g) => g.name === category))
                .map((anime) => (
                  <div className="anime-list-item" key={anime.mal_id}>
                    <Link to={`/anime/${anime.mal_id}`}>
                      <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                      <h3>{anime.title}</h3>
                      <p>{anime.title_english && `English: ${anime.title_english}`}</p>
                      <p>{anime.title_japanese && `Japanese: ${anime.title_japanese}`}</p>
                      <p>{anime.title_synonyms && `Synonyms: ${anime.title_synonyms.join(', ')}`}</p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {loading && <p>Loading more...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>
    </div>
  );
}

export default AnimeList;
