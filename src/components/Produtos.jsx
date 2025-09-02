import React from 'react';

// Componente que lista produtos e permite filtragem/adição ao carrinho
export default function Produtos({
  produtos,                  // lista de produtos a exibir
  categorias,                // lista de categorias disponíveis
  categoriaSelecionada,      // categoria atualmente selecionada no filtro
  setCategoriaSelecionada,   // função para alterar a categoria selecionada
  ordemPreco,                // ordenação de preço atual ('asc', 'desc', 'nenhum')
  setOrdemPreco,             // alterar a ordenação de preço
  onAdicionar,               // fadicionar produto ao carrinho
}) {
  return (
    <>
      {/* Filtros de categoria e preço */}
      <div className="filtros container">
        {/* WRAP interno: força alinhar à ESQUERDA sem mudar largura/espessura */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px 12px',
            margin: '20px 0 24px',
            textAlign: 'left',
            // truques que colam à esquerda mesmo se o pai centraliza:
            marginLeft: 0,
            marginRight: 'auto',
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <label>
            Categoria:
            <select
              value={categoriaSelecionada} //selecionado no filtro
              onChange={(e) => setCategoriaSelecionada(e.target.value)} // atualiza categoria
            >
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Preço:
            <select
              value={ordemPreco} // valor selecionado para ordenação
              onChange={(e) => setOrdemPreco(e.target.value)} // atualiza ordenação
            >
              <option value="nenhum">Sem ordenação</option>
              <option value="asc">Menor valor</option>
              <option value="desc">Maior valor</option>
            </select>
          </label>
        </div>
      </div>

      {/* Lista de produtos em grade */}
      <section className="grid-produtos container">
        {produtos.map((p) => (
          <article className="card-produto" key={p.id ?? p.produto}>

            {/* Imagem do produto */}
            <div className="img-wrap">
              <img className="img-produto" src={p.imagem} alt={p.produto} />
            </div>

            {/* Nome do produto */}
            <h3 className="nome-produto">{p.produto}</h3>

            {/* Categoria do produto */}
            <span className="tag">{p.categoria}</span>

            {/* Descrição do produto */}
            <p className="desc-produto">{p.descricao}</p>

            {/* Preço do produto, formatado em reais */}
            <div className="preco">R${(p.precoNumber || 0).toFixed(2).replace('.', ',')}</div>

            {/* Botão para adicionar ao carrinho */}
            <button className="btn btn-add" onClick={() => onAdicionar(p)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
