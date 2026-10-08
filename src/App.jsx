import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import RecuperarSenha from './components/RecuperarSenha';
import Painel from './components/Painel';
import { acordarBackend, logout } from './services/api';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'cadastro' | 'recuperar-senha' | 'painel'
  const [currentUser, setCurrentUser] = useState(null);

  // O servidor do Render dorme no plano gratuito e a primeira
  // chamada demora ~50s (secao 1 do contrato). Aquecemos a API
  // assim que o site abre para encurtar a espera no login.
  useEffect(() => {
    acordarBackend();
  }, []);

  const handleLoginSuccess = (data) => {
    // data = { token, usuario } - role vem de GET /usuarios/me.
    // Sem esta navegacao o login ficava preso em "Redirecionando...".
    setCurrentUser(data);
    setCurrentPage('painel');
  };

  const handleLogout = () => {
    logout(); // apaga token e dados do localStorage (secao 5)
    setCurrentUser(null);
    setCurrentPage('login');
  };

  // Sem sessao nao existe painel: volta para o login.
  const page =
    currentPage === 'painel' && !currentUser ? 'login' : currentPage;

  return (
    <div className="app-layout">
      <Navbar
        onNavigate={setCurrentPage}
        currentPage={page}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {page === 'login' && (
          <Login
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {page === 'cadastro' && <Cadastro onNavigate={setCurrentPage} />}

        {page === 'recuperar-senha' && (
          <RecuperarSenha onNavigate={setCurrentPage} />
        )}

        {page === 'painel' && (
          <Painel session={currentUser} onLogout={handleLogout} />
        )}
      </main>

      <Footer />
    </div>
  );
}

