import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import RecuperarSenha from './components/RecuperarSenha';
import { acordarBackend } from './services/api';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'cadastro' | 'recuperar-senha'
  const [currentUser, setCurrentUser] = useState(null);

  // O servidor do Render dorme no plano gratuito e a primeira
  // chamada demora ~50s (secao 1 do contrato). Aquecemos a API
  // assim que o site abre para encurtar a espera no login.
  useEffect(() => {
    acordarBackend();
  }, []);

  const handleLoginSuccess = (data) => {
    // data = { token, usuario } - role vem de GET /usuarios/me
    setCurrentUser(data);
  };

  return (
    <div className="app-layout">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      <main className="main-content">
        {currentPage === 'login' && (
          <Login
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'cadastro' && (
          <Cadastro onNavigate={setCurrentPage} />
        )}

        {currentPage === 'recuperar-senha' && (
          <RecuperarSenha onNavigate={setCurrentPage} />
        )}
      </main>

      <Footer />
    </div>
  );
}

