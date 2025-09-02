import React from "react";

// Componente do carrinho de compras
export default function Carrinho({
  aberto,       // carrinho visível
  fechar,       // fechar o carrinho
  itens,        // lista de produtos 
  total,        // valor total do carrinho
  onRemover,    // remover um item
  onFinalizar,  // finalizar a compra
}) {
  // Se não estiver aberto, não renderiza nada.
  // Isso elimina qualquer "filete" aparecendo em telas menores.
  if (!aberto) return null;

  // Formata valores em reais (R$ 10,50)
  const fmt = (v) =>
    typeof v === "string"
      ? v
      : `R$ ${Number(v || 0).toFixed(2).replace(".", ",")}`;

  // Caso a imagem do produto não carregue, exibe um placeholder
  const onImgError = (e) => {
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>'
      );
  };

  return (
    <aside className="carrinho aberto" role="dialog" aria-label="Seu carrinho" aria-modal="true">
      <div className="carrinho-header">
        <h2>Seu carrinho</h2>
        <button className="btn-fechar" onClick={fechar} aria-label="Fechar">
          ×
        </button>
      </div>

      {/* Lista de produtos */}
      <div className="carrinho-itens">
        {/* Mensagem caso o carrinho esteja vazio */}
        {(!itens || itens.length === 0) && <p>Sem itens por aqui ainda 🙂</p>}

        {itens?.map((item) => {
          const nome = item.produto || item.nome;
          const subtotal = (item.precoNumber || 0) * (item.qtd || 1);
          const subtotalTxt = `R$ ${Number(subtotal).toFixed(2).replace(".", ",")}`;
          const unitTxt = `R$ ${Number(item.precoNumber || 0).toFixed(2).replace(".", ",")}`;

          return (
            <div key={item.id ?? `${nome}-${unitTxt}`} className="linha-carrinho">
              {/* Imagem */}
              <img
                src={item.imagem}
                alt={nome}
                className="thumb-carrinho"
                onError={onImgError}
              />

              {/* Info */}
              <div className="info-cart">
                {/* Nome e subtotal */}
                <div className="row-1">
                  <strong className="titulo-cart" title={nome}>
                    {nome}
                  </strong>
                  <div className="preco-linha">{subtotalTxt}</div>
                </div>

                {/* Quantidade e remover */}
                <div className="row-2">
                  <span className="qtd">Qtd: {item.qtd}</span>
                  <button
                    className="btn-remove cart-remove"
                    onClick={() => onRemover(item.id)}
                  >
                    Remover
                  </button>
                </div>

                {/* Preço unitário */}
                <div className="chip-unit">{unitTxt}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé */}
      <div className="carrinho-footer">
        <div className="total">
          <span>Total</span>
          <strong>{fmt(total)}</strong>
        </div>
        <button className="btn-finalizar" onClick={onFinalizar}>
          Finalizar compra
        </button>
      </div>
    </aside>
  );
}
