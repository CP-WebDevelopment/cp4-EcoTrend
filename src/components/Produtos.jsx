import React from 'react';
import '../css/produto.css';

function Produto({ produto, adicionarCarrinho }) {
  return (
    <div className="produto-card">
      <img src={produto.imagem} alt={produto.produto} />
      <h3>{produto.produto}</h3>
      <p>{produto.descricao}</p>
      <p className="valor">{produto.valor}</p>
      <button onClick={() => adicionarCarrinho(produto)}>Adicionar ao carrinho</button>
    </div>
  );
}

export default Produto;
