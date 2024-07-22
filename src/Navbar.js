import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Ícone de hambúrguer

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <button className="nav-button">Home</button>
      </Link>
      <Link to="/favorites">
        <button className="nav-button">Favoritos</button>
      </Link>
      {/* Adicione outros links se necessário */}
    </nav>
  );
}

export default Navbar;
