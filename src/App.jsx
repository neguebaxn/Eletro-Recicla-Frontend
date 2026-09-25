import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import RecuperarSenha from './components/RecuperarSenha';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'cadastro' | 'recuperar-senha'
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (data) => {
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

