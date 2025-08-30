import React from 'react';

export default function Produtos({
  produtos,
  categorias,
  categoriaSelecionada,
  setCategoriaSelecionada,
  ordemPreco,
  setOrdemPreco,
  onAdicionar,
}) {
  return (
    <>
      <div className="filtros container">
        <label>
          Categoria:
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Preço:
          <select
            value={ordemPreco}
            onChange={(e) => setOrdemPreco(e.target.value)}
          >
            <option value="nenhum">Sem ordenação</option>
            <option value="asc">Menor valor</option>
            <option value="desc">Maior valor</option>
          </select>
        </label>
      </div>

      <section className="grid-produtos container">
        {produtos.map((p) => (
          <article className="card-produto" key={p.id ?? p.produto}>
            <div className="img-wrap">
              <img className="img-produto" src={p.imagem} alt={p.produto} />
            </div>

            <h3 className="nome-produto">{p.produto}</h3>

            <span className="tag">{p.categoria}</span>

            <p className="desc-produto">{p.descricao}</p>

            <div className="preco">R${(p.precoNumber || 0).toFixed(2).replace('.', ',')}</div>

            <button className="btn btn-add" onClick={() => onAdicionar(p)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
