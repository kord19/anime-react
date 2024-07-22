import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnimeList from './AnimeList';
import AnimeDetail from './AnimeDetail';
import EpisodePlayer from './EpisodePlayer';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Anime-Viewer</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<AnimeList />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/anime/:name/episode/:episode" element={<EpisodePlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
