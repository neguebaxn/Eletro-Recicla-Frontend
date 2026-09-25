import React from 'react';
import { Leaf } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onNavigate, currentPage }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => onNavigate('login')}>
          <div className="brand-icon">
            <Leaf size={20} className="leaf-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-title">ELETRORECICLA</span>
            <span className="brand-sub">ECONOMIA CIRCULAR</span>
          </div>
        </div>

        <nav className="navbar-menu">
          <a href="#inicio" className="nav-item active">Início</a>
          <a href="#como-funciona" className="nav-item">Como Funciona</a>
          <a href="#pontos-de-coleta" className="nav-item">Pontos de Coleta</a>
          <a href="#materiais" className="nav-item">Materiais</a>
          <a href="#educacao" className="nav-item">Educação</a>
        </nav>

        <div className="navbar-actions">
          {currentPage !== 'login' ? (
            <button
              type="button"
              className="btn-text"
              onClick={() => onNavigate('login')}
            >
              Entrar
            </button>
          ) : (
            <button
              type="button"
              className="btn-text"
              onClick={() => onNavigate('cadastro')}
            >
              Cadastre-se
            </button>
          )}

          <button
            type="button"
            className="btn-primary-dark"
            onClick={() => onNavigate('cadastro')}
          >
            Descarte Agora
          </button>
        </div>
      </div>
    </header>
  );
}
