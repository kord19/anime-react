import React from 'react';
import Navbar from './Navbar'; // Importar Navbar

function Favorite() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  return (
    <div className="main-content">
      <nav className="navbar">
        
      </nav>
      <h1>Favoritos</h1>
      <div className="anime-list">
        {favorites.length === 0 ? (
          <p>Você ainda não tem favoritos.</p>
        ) : (
          favorites.map((anime, index) => (
            <div className="anime-list-item" key={index}>
              <a href={anime.videoUrl} target="_blank" rel="noopener noreferrer">
                <h3>{anime.name}</h3>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorite;
