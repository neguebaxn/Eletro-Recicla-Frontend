import React, { useState } from 'react';
import { User, Briefcase, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cadastrarUsuario } from '../services/api';
import './Cadastro.css';

export default function Cadastro({ onNavigate }) {
  const [perfil, setPerfil] = useState('cidadao');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [termos, setTermos] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCpfChange = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(v);
  };

  const handleCelularChange = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 9) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    setCelular(v);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!termos) {
      setErrorMessage('Aceite os Termos de Uso e a Política de Privacidade.');
      return;
    }
    if (senha !== confirmaSenha) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha: senha,
        telefone: celular.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
      });
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => onNavigate('login'), 1800);
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-wrapper">
      <div className="cadastro-header">
        <span className="cadastro-eyebrow">CRIE SUA CONTA GRATUITA</span>
        <h1 className="cadastro-title">Escolha o seu perfil de acesso</h1>
      </div>

      <div className="profile-selector">
        <div className={`profile-card ${perfil === 'cidadao' ? 'active' : ''}`} onClick={() => setPerfil('cidadao')}>
          <div className="profile-card-header">
            <div className="profile-avatar"><User size={20} /></div>
            <div className={`radio-dot ${perfil === 'cidadao' ? 'checked' : ''}`}><div className="inner-dot"></div></div>
          </div>
          <h3 className="profile-name">Cidadão</h3>
          <p className="profile-desc">Quero descartar meu lixo eletrônico pessoal, acumular pontos e obter vantagens locais.</p>
        </div>

        <div className={`profile-card ${perfil === 'empresa' ? 'active' : ''}`} onClick={() => setPerfil('empresa')}>
          <div className="profile-card-header">
            <div className="profile-avatar"><Briefcase size={20} /></div>
            <div className={`radio-dot ${perfil === 'empresa' ? 'checked' : ''}`}><div className="inner-dot"></div></div>
          </div>
          <h3 className="profile-name">Empresa</h3>
          <p className="profile-desc">Quero realizar o descarte corporativo em lote com rastreabilidade completa e laudos.</p>
        </div>

        <div className={`profile-card ${perfil === 'ponto' ? 'active' : ''}`} onClick={() => setPerfil('ponto')}>
          <div className="profile-card-header">
            <div className="profile-avatar"><MapPin size={20} /></div>
            <div className={`radio-dot ${perfil === 'ponto' ? 'checked' : ''}`}><div className="inner-dot"></div></div>
          </div>
          <h3 className="profile-name">Ponto de Coleta</h3>
          <p className="profile-desc">Quero cadastrar meu estabelecimento como um ponto credenciado de captação.</p>
        </div>
      </div>

      <div className="cadastro-card">
        <h2 className="form-card-title">
          {perfil === 'cidadao' ? 'Dados do Cidadão' : perfil === 'empresa' ? 'Dados da Empresa' : 'Dados do Ponto de Coleta'}
        </h2>

        {errorMessage && <div className="cadastro-alert error"><AlertCircle size={18} /><span>{errorMessage}</span></div>}
        {successMessage && <div className="cadastro-alert success"><CheckCircle2 size={18} /><span>{successMessage}</span></div>}

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group full-width">
            <label htmlFor="nome">Nome Completo</label>
            <input id="nome" type="text" placeholder="Ana Silva Santos" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input id="cpf" type="text" placeholder="123.456.789-00" value={cpf} onChange={handleCpfChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="celular">Celular</label>
              <input id="celular" type="text" placeholder="(11) 98765-4321" value={celular} onChange={handleCelularChange} required />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="ana.silva@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="senha">Crie uma Senha</label>
              <input id="senha" type="password" placeholder="••••••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmaSenha">Confirme a Senha</label>
              <input id="confirmaSenha" type="password" placeholder="••••••••••••" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required />
            </div>
          </div>

          <div className="form-checkboxes">
            <div className="form-checkbox">
              <input id="termos" type="checkbox" checked={termos} onChange={(e) => setTermos(e.target.checked)} />
              <label htmlFor="termos">Li e aceito os Termos de Uso e a Política de Privacidade da plataforma.</label>
            </div>
            <div className="form-checkbox">
              <input id="newsletter" type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
              <label htmlFor="newsletter">Desejo receber dicas de reciclagem e novidades do EletroRecicla no meu e-mail.</label>
            </div>
          </div>

          <button type="submit" className="btn-concluir" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Concluir Cadastro'}
          </button>
        </form>

        <p className="cadastro-bottom-text">
          Já tem cadastro?{' '}
          <button type="button" className="link-accent" onClick={() => onNavigate('login')}>
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
}

