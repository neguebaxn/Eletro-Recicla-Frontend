import React, { useEffect, useState } from 'react';
import { Leaf, LogOut, Mail, ShieldCheck, Hash } from 'lucide-react';
import { getPerfil } from '../services/api';
import './Painel.css';

// Tela exibida apos o login (secao 2 do contrato): o token ja esta
// salvo e id/role vem do GET /usuarios/me.
export default function Painel({ session, onLogout }) {
  const [usuario, setUsuario] = useState(session?.usuario || null);
  const [carregando, setCarregando] = useState(!session?.usuario);
  const [erroPerfil, setErroPerfil] = useState('');

  // O /usuarios/me e best-effort durante o login; se falhou (Render
  // dormindo, rede), tentamos de novo aqui para mostrar id e role.
  useEffect(() => {
    // session?.usuario ja veio do login -> carregando inicia em false
    if (session?.usuario) return undefined;
    let ativo = true;
    getPerfil()
      .then((me) => {
        if (ativo) setUsuario(me);
      })
      .catch((err) => {
        if (ativo) setErroPerfil(err.message || 'erro desconhecido');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [session?.usuario]);

  const nome = usuario?.nome || 'Usuário';
  const email =
    usuario?.email || localStorage.getItem('eletrorecicla_user_email') || '—';
  const role = usuario?.role || null;
  const iniciais =
    nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="painel-wrapper">
      <div className="painel-card">
        <div className="painel-header">
          <div className="painel-avatar">{iniciais}</div>
          <div className="painel-greeting">
            <span className="painel-hello">Bem-vindo de volta</span>
            <h1 className="painel-nome">{nome}</h1>
          </div>
          {role && (
            <span
              className={`painel-badge ${
                role === 'ADMIN' ? 'painel-badge-admin' : ''
              }`}
            >
              <ShieldCheck size={14} />
              {role}
            </span>
          )}
        </div>

        <div className="painel-info">
          <div className="painel-info-row">
            <Mail size={16} />
            <div>
              <span className="painel-info-label">Email</span>
              <span className="painel-info-value">{email}</span>
            </div>
          </div>
          <div className="painel-info-row">
            <Hash size={16} />
            <div>
              <span className="painel-info-label">ID da conta</span>
              <span className="painel-info-value">{usuario?.id ?? '—'}</span>
            </div>
          </div>
          <div className="painel-info-row">
            <Leaf size={16} />
            <div>
              <span className="painel-info-label">Sessão</span>
              <span className="painel-info-value">
                {session?.token ? 'Ativa (token salvo)' : 'Sem token'}
              </span>
            </div>
          </div>
        </div>

        {carregando && <p className="painel-status">Carregando perfil…</p>}

        {!carregando && !usuario && (
          <p className="painel-status painel-status-erro">
            Não foi possível carregar o perfil ({erroPerfil}), mas você continua
            logado.
          </p>
        )}

        <div className="painel-actions">
          <button type="button" className="btn-sair" onClick={onLogout}>
            <LogOut size={16} />
            <span>Sair da conta</span>
          </button>
        </div>

        <p className="painel-dica">
          Login concluído com sucesso. Em breve por aqui: histórico de coletas,
          créditos verdes e mapa de pontos de coleta.
        </p>
      </div>
    </div>
  );
}
