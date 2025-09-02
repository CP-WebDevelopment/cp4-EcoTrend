import React from 'react';
import "../css/header.css";

import carrinhoBranco from '../assets/carrinho.png';
import perfilIcon     from '../assets/perfil.png';
import lupaIcon       from '../assets/lupa.png';
import folhaIcon      from '../assets/folha.png'; // <- nova imagem da folha

export default function Header({ abrirCarrinho, itensCarrinho = 0 }) {
  return (
    <header className="header">
      {/* Logo escrita + folha */}
      <h1 className="logo">
        <span className="eco">Eco</span>
        <span className="trend">Trend</span>
        <img src={folhaIcon} alt="" className="logo-leaf" aria-hidden="true" />
      </h1>

      {/* Perfil + Lupa (imagens) e Carrinho (botão) */}
      <div className="header-actions">
        <img src={perfilIcon} alt="Perfil" className="icone-header" />
        <img src={lupaIcon}   alt="Buscar" className="icone-header" />

        {/* Carrinho — inalterado */}
        <button className="btn-carrinho" onClick={abrirCarrinho} aria-label="Abrir carrinho">
          <img src={carrinhoBranco} alt="Carrinho" className="icone-carrinho" />
          {itensCarrinho > 0 && <span className="badge-carrinho">{itensCarrinho}</span>}
        </button>
      </div>
    </header>
  );
}
