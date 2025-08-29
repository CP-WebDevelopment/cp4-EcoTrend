import React from 'react';
import '../css/header.css';
import carrinhoIcon from '../assets/carrinho.png';

function Header({ abrirCarrinho, quantidade }) {
  return (
    <header className="header">
      <h1>EcoTrend</h1>
      <button onClick={abrirCarrinho} className="botao-carrinho">
        <img src={carrinhoIcon} alt="Carrinho" className="carrinho-img" />
        {quantidade > 0 && <span className="badge">{quantidade}</span>}
      </button>
    </header>
  );
}

export default Header;
