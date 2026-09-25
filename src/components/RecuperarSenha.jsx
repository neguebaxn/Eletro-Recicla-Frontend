import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './RecuperarSenha.css';

export default function RecuperarSenha({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simula disparo de recuperação de senha
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 800);
  };

  return (
    <div className="recuperar-wrapper">
      <div className="recuperar-container">
        {/* Card Formulário de Recuperação */}
        <div className="recuperar-card">
          <div className="lock-icon-box">
            <Lock size={22} />
          </div>

          <h1 className="recuperar-title">Recupere sua senha</h1>
          <p className="recuperar-subtitle">
            Esqueceu suas credenciais? Não se preocupe. Digite o e-mail cadastrado abaixo e enviaremos um link para redefinição segura.
          </p>

          <form onSubmit={handleSubmit} className="recuperar-form">
            <div className="form-group">
              <label htmlFor="recup-email">Email Cadastrado</label>
              <input
                id="recup-email"
                type="email"
                placeholder="ana.silva@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-enviar-instrucoes"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Instruções de Recuperação'}
            </button>
          </form>

          <button
            type="button"
            className="btn-voltar-login"
            onClick={() => onNavigate('login')}
          >
            <ArrowLeft size={16} />
            <span>Voltar para o Login</span>
          </button>
        </div>

        {/* Card de Confirmação (ao lado, exatamente como no layout do Figma) */}
        {enviado && (
          <div className="sucesso-card">
            <div className="sucesso-header">
              <div className="sucesso-icon">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="sucesso-title">E-mail enviado com sucesso!</h3>
            </div>

            <p className="sucesso-body">
              Enviamos as instruções para <strong>{email}</strong>. Verifique sua caixa de entrada e spam. O link expira em 24 horas.
            </p>

            <div className="sucesso-footer">
              <span className="nao-recebeu">Não recebeu?</span>
              <button
                type="button"
                className="btn-reenviar"
                onClick={handleSubmit}
              >
                Clique para reenviar e-mail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
