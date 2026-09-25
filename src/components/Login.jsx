import React, { useState } from 'react';
import { Eye, EyeOff, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUsuario } from '../services/api';
import './Login.css';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [manterConectado, setManterConectado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUsuario(email, senha);
      setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      if (onLoginSuccess) {
        onLoginSuccess(res);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">
            Insira suas credenciais para gerenciar seus descartes
          </p>

          <div className="social-buttons">
            <button type="button" className="btn-social">
              <span className="google-icon-g">G</span>
              <span>Entrar com o Google</span>
            </button>
            <button type="button" className="btn-social btn-gov">
              <span className="gov-badge">gov.br</span>
              <span>Entrar com Gov.br</span>
            </button>
          </div>

          <div className="login-divider">
            <span>ou</span>
          </div>

          {errorMessage && (
            <div className="login-alert error">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-alert success">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email corporativo ou pessoal</label>
              <input
                id="email"
                type="email"
                placeholder="exemplo@eletrorecicla.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="senha">Senha</label>
                <button
                  type="button"
                  className="link-forgot"
                  onClick={() => onNavigate('recuperar-senha')}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="password-input-wrapper">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-checkbox">
              <input
                id="manterConectado"
                type="checkbox"
                checked={manterConectado}
                onChange={(e) => setManterConectado(e.target.checked)}
              />
              <label htmlFor="manterConectado">
                Manter conectado neste dispositivo
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </button>
          </form>

          <p className="login-bottom-text">
            Não tem conta?{' '}
            <button
              type="button"
              className="link-accent"
              onClick={() => onNavigate('cadastro')}
            >
              Cadastre-se
            </button>
          </p>
        </div>

        <div className="login-banner">
          <div className="banner-bg-overlay"></div>
          <div className="banner-content">
            <div className="banner-brand">
              <div className="banner-icon">
                <Leaf size={18} />
              </div>
              <span className="banner-title">EletroRecicla</span>
            </div>

            <div className="banner-body">
              <h2 className="banner-heading">
                Menos resíduos, mais benefícios.
              </h2>
              <p className="banner-text">
                Faça o login para verificar seus créditos verdes acumulados e ver o impacto em CO2 gerado pelas suas entregas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
