import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useQuery, gql, ApolloProvider } from '@apollo/client';
import client from './apollo-client';

// Query GraphQL para obter detalhes do anime, incluindo títulos alternativos
const GET_ANIME_EPISODES = gql`
  query GetAnimeEpisodes($name: String!) {
    Media(search: $name, type: ANIME) {
      title {
        romaji
        english
        native
        userPreferred
      }
      episodes
    }
  }
`;

// Função para verificar se a URL do vídeo é válida
async function checkVideoUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      return url;
    } else {
      throw new Error('URL não encontrada');
    }
  } catch (error) {
    return null;
  }
}

function EpisodePlayer() {
  const { name, episode } = useParams();
  const navigate = useNavigate();
  const episodeNumber = parseInt(episode, 10);

  // Fazendo a query GraphQL para obter informações do anime
  const { loading, error, data } = useQuery(GET_ANIME_EPISODES, {
    variables: { name },
  });

  const [videoUrl, setVideoUrl] = useState('');
  const [nameAlternatives, setNameAlternatives] = useState([]);

  useEffect(() => {
    if (data) {
      const alternatives = [
        data.Media.title.romaji,
        data.Media.title.english,
        data.Media.title.native,
        data.Media.title.userPreferred,
      ].filter(title => title);

      setNameAlternatives(alternatives);

      // Formatar o nome do anime para criar a URL do vídeo
      const formattedName = alternatives
        .map(name => name.split(' ').map(word => word.toLowerCase()).join('-'))
        .find(name => name); // Usar o primeiro nome alternativo formatado

      if (formattedName) {
        const formattedEpisode = episodeNumber >= 10 ? episode : `0${episode}`;
        const initialUrl = `https://cdn01-s1.mywallpaper-cdn-4k.com/stream/${formattedName[0]}/${formattedName}/${formattedEpisode}.mp4/index.m3u8`;
        const fallbackUrl = `https://cdn-s01.mywallpaper-4k-image.net/stream/${formattedName[0]}/${formattedName}/${formattedEpisode}.mp4/index.m3u8`;

        async function updateVideoUrl() {
          const validUrl = await checkVideoUrl(initialUrl);
          if (validUrl) {
            setVideoUrl(validUrl);
          } else {
            setVideoUrl(fallbackUrl);
          }
        }

        updateVideoUrl();
      }
    }
  }, [data, episodeNumber, name]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar episódios.</p>;

  const episodes = data ? Array.from({ length: data.Media.episodes }, (_, i) => i + 1) : [];
  const nameFormatted = name
    .split(' ')
    .map(word => word.toLowerCase())
    .join('-');

  // Calcular o próximo episódio
  const nextEpisodeNumber = episodeNumber + 1;

  const handleNextEpisode = () => {
    if (nextEpisodeNumber <= data.Media.episodes) {
      navigate(`/anime/${nameFormatted}/episode/${nextEpisodeNumber}`);
    }
  };

  return (
    <div className="player-wrapper">
      <ReactPlayer url={videoUrl} controls width="100%" height="70%" className="react-player" />
      <div className="navigation-buttons">
        {episodeNumber > 1 && (
          <Link to={`/anime/${nameFormatted}/episode/${episodeNumber - 1}`} className="nav-button">
            Episódio Anterior
          </Link>
        )}
        <button onClick={handleNextEpisode} className="nav-button">
          Próximo Episódio
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <EpisodePlayer />
    </ApolloProvider>
  );
}

export default App;
