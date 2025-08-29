import React from 'react';
import '../css/carrinho.css';

function Carrinho({ aberto, fechar, produtos, setProdutos }) {

  const removerProduto = (id) => {
    const novosProdutos = produtos.filter(prod => prod.id !== id);
    setProdutos(novosProdutos);
    localStorage.setItem('carrinho', JSON.stringify(novosProdutos));
  };

  return (
    <div className={`carrinho-sidebar ${aberto ? 'aberto' : ''}`}>
      <div className="carrinho-header">
        <h2>Carrinho</h2>
        <button onClick={fechar}>X</button>
      </div>

      {produtos.length === 0 ? (
        <p>O carrinho está vazio!</p>
      ) : (
        <ul className="carrinho-lista">
          {produtos.map((produto) => (
            <li key={produto.id}>
              <span>{produto.produto} - {produto.quantidade}x</span>
              <span>{produto.valor}</span>
              <button onClick={() => removerProduto(produto.id)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Carrinho;
