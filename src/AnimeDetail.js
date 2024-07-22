import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AnimeDetail.css';

function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [genre, setGenre] = useState('');
  const [suggestedAnimes, setSuggestedAnimes] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        const animeData = response.data.data;
        setAnime(animeData);
        if (animeData.genres && animeData.genres.length > 0) {
          setGenre(animeData.genres[0].name);
        }
        fetchEpisodes(animeData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const fetchEpisodes = async (animeData) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeData.mal_id}/episodes`);
      setEpisodes(response.data.data);
    } catch (err) {
      console.error(`Error fetching episodes for anime ID: ${animeData.mal_id}`, err);
      // Fallback: Attempt to find episodes using alternative titles
      const titlesToTry = [animeData.title, animeData.title_english, animeData.title_japanese, ...animeData.title_synonyms];
      for (const title of titlesToTry) {
        if (title) {
          try {
            const response = await axios.get('https://api.jikan.moe/v4/anime', {
              params: { q: title, limit: 1 }
            });
            const foundAnime = response.data.data[0];
            if (foundAnime && foundAnime.episodes) {
              setEpisodes(foundAnime.episodes);
              break;
            }
          } catch (err) {
            console.error(`Error fetching episodes for title: ${title}`, err);
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchSuggestedAnimes = async () => {
      if (genre) {
        setLoading(true);
        try {
          const response = await axios.get('https://api.jikan.moe/v4/anime', {
            params: {
              genres: genre,
              page: 1,
              limit: 5,
              exclude_ids: id,
            },
          });
          setSuggestedAnimes(response.data.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuggestedAnimes();
  }, [genre, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!anime) return <p>No anime details available.</p>;

  const { title, images, synopsis, genres, relations, title_english, title_japanese, title_synonyms } = anime;
  const name = title;

  const nextSeason = relations && Array.isArray(relations) ? relations.find((relation) => relation.relation_type === 'sequel') : null;

  const handleNextSeason = () => {
    if (nextSeason) {
      navigate(`/anime/${nextSeason.mal_id}`);
    }
  };

  return (
    <div className="main-content anime-detail">
      <div className="anime-banner">
        <img src={images.jpg.large_image_url} alt={`${name} Banner`} />
      </div>
      <div className="anime-info">
        <h1>{name}</h1>
        <p><strong>English Title:</strong> {title_english}</p>
        <p><strong>Japanese Title:</strong> {title_japanese}</p>
        <p><strong>Synonyms:</strong> {title_synonyms.join(', ')}</p>
        <p>{synopsis}</p>
        <p><strong>Total Episodes:</strong> {episodes.length || 'N/A'}</p>
        <p><strong>Genres:</strong> {genres.map((genre) => genre.name).join(', ')}</p>
      </div>
      <div className="episode-list">
        {episodes.length > 0 ? (
          episodes.map((episode, index) => (
            <Link key={episode.mal_id} to={`/anime/${name}/episode/${index + 1}`}>
              <button className="episode-button">Episode {index + 1}</button>
            </Link>
          ))
        ) : (
          <p>No episodes available.</p>
        )}
      </div>
      {nextSeason && (
        <button onClick={handleNextSeason} className="next-season-button">
          Próxima Temporada: {nextSeason.title}
        </button>
      )}
      <div className="suggested-anime">
        <h2>Animes similares</h2>
        <div className="suggested-anime-list">
          {suggestedAnimes.length > 0 ? (
            suggestedAnimes.map((anime) => (
              <div key={anime.mal_id} className="suggested-anime-item">
                <Link to={`/anime/${anime.mal_id}`}>
                  <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                  <h3>{anime.title}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No similar animes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;
