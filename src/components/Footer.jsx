import React from 'react';
import { Leaf } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-icon">
                <Leaf size={18} className="footer-leaf" />
              </div>
              <span className="footer-brand-title">EletroRecicla</span>
            </div>
            <p className="footer-desc">
              Transformando o descarte de resíduos eletrônicos em impacto social e ambiental positivo por todo o Brasil. Conectamos quem quer descartar a quem sabe reaproveitar.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">PLATAFORMA</h4>
            <ul className="footer-list">
              <li><a href="#sobre">Sobre Nós</a></li>
              <li><a href="#pontos">Pontos de Coleta</a></li>
              <li><a href="#parceiros">Parceiros</a></li>
              <li><a href="#impacto">Impacto</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">MATERIAIS</h4>
            <ul className="footer-list">
              <li><a href="#celulares">Celulares</a></li>
              <li><a href="#computadores">Computadores</a></li>
              <li><a href="#baterias">Baterias</a></li>
              <li><a href="#eletroportateis">Eletroportáteis</a></li>
              <li><a href="#monitores">Monitores</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">LEGAL</h4>
            <ul className="footer-list">
              <li><a href="#termos">Termos de Uso</a></li>
              <li><a href="#privacidade">Privacidade</a></li>
              <li><a href="#politicas">Políticas</a></li>
              <li><a href="#fale-conosco">Fale Conosco</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 EletroRecicla. Todos os direitos reservados. CNPJ: 12.345.678/0001-90
          </p>
          <div className="footer-socials">
            <a href="#instagram" aria-label="Instagram" className="social-bubble">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#facebook" aria-label="Facebook" className="social-bubble">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-bubble">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#youtube" aria-label="YouTube" className="social-bubble">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                <polygon points="10 15 15 12 10 9 10 15"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

