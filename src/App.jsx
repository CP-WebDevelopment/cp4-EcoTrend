import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Carrinho from './components/Carrinho';
import Produtos from './components/Produtos';

import './css/global.css';
import './css/estilo.css';
import './css/produto.css';

// utils
const parseValor = (s) => {
  if (s == null) return 0;
  if (typeof s === 'number') return s;
  return Number(String(s).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};
const inferirCategoria = (titulo) => {
  const t = (titulo || '').toLowerCase();
  if (t.includes('base líquida')) return 'Base Líquida';
  if (t.includes('base solida') || t.includes('base sólida')) return 'Base Sólida';
  if (t.includes('batom')) return 'Batom';
  if (t.includes('balm')) return 'Balm';
  if (t.includes('iluminador')) return 'Iluminador';
  if (t.includes('corretivo')) return 'Corretivo';
  if (t.includes('máscara') || t.includes('mascara')) return 'Máscara';
  if (t.includes('delineador') || t.includes('deliniador')) return 'Delineador';
  if (t.includes('necessaire')) return 'Acessórios';
  return 'Outros';
};

export default function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [produtosCatalogo, setProdutosCatalogo] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [ordemPreco, setOrdemPreco] = useState('nenhum'); // asc | desc | nenhum

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const fecharCarrinho = () => setCarrinhoAberto(false);

  useEffect(() => {
    fetch('/produtos.json')
      .then((r) => {
        if (!r.ok) throw new Error('sem local');
        return r.json();
      })
      .then(normalizar)
      .catch(() => {
        const urlRemota = 'https://raw.githubusercontent.com/CP-WebDevelopment/produtosEcoTrend/main/produtos.json';
        fetch(urlRemota)
          .then((r) => r.json())
          .then(normalizar)
          .catch((e) => console.error('Falha ao carregar produtos:', e));
      });
  }, []);

  function normalizar(data) {
    const lista = (Array.isArray(data) ? data : []).map((p, i) => {
      const titulo = p.produto ?? p.nome ?? `Produto ${i + 1}`;
      const precoNumber = p.precoNumber ?? parseValor(p.valor ?? p.preco);
      const categoria = p.categoria ?? inferirCategoria(titulo);
      return { ...p, produto: titulo, precoNumber, categoria };
    });
    setProdutosCatalogo(lista);
  }

  const categorias = useMemo(() => {
    const s = new Set(produtosCatalogo.map((p) => p.categoria).filter(Boolean));
    return ['Todos', ...Array.from(s)];
  }, [produtosCatalogo]);

  const produtosFiltrados = useMemo(() => {
    let lista = [...produtosCatalogo];
    if (categoriaSelecionada !== 'Todos') {
      lista = lista.filter((p) => p.categoria === categoriaSelecionada);
    }
    if (ordemPreco === 'asc') lista.sort((a, b) => a.precoNumber - b.precoNumber);
    if (ordemPreco === 'desc') lista.sort((a, b) => b.precoNumber - a.precoNumber);
    return lista;
  }, [produtosCatalogo, categoriaSelecionada, ordemPreco]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((ant) => {
      const existe = ant.find((i) => i.id === produto.id);
      if (existe) return ant.map((i) => (i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i));
      return [...ant, { ...produto, qtd: 1 }];
    });
  };
  const removerDoCarrinho = (id) => {
    setCarrinho((ant) => {
      const item = ant.find((i) => i.id === id);
      if (!item) return ant;
      if (item.qtd > 1) return ant.map((i) => (i.id === id ? { ...i, qtd: i.qtd - 1 } : i));
      return ant.filter((i) => i.id !== id);
    });
  };
  const limparCarrinho = () => setCarrinho([]);

  const total = useMemo(
    () =>
      carrinho.reduce(
        (acc, i) => acc + (i.precoNumber || parseValor(i.valor || i.preco)) * i.qtd,
        0
      ),
    [carrinho]
  );

  return (
    <>
      <Header abrirCarrinho={abrirCarrinho} itensCarrinho={carrinho.reduce((a, i) => a + i.qtd, 0)} />
      <main className="container">
        <Produtos
          produtos={produtosFiltrados}
          categorias={categorias}
          categoriaSelecionada={categoriaSelecionada}
          setCategoriaSelecionada={setCategoriaSelecionada}
          ordemPreco={ordemPreco}
          setOrdemPreco={setOrdemPreco}
          onAdicionar={adicionarAoCarrinho}
        />
      </main>
      <Carrinho
        aberto={carrinhoAberto}
        fechar={fecharCarrinho}
        itens={carrinho}
        total={total}
        onRemover={removerDoCarrinho}
        onFinalizar={() => {
          alert('Compra finalizada! 🎉');
          limparCarrinho();
          fecharCarrinho();
        }}
      />
      <Footer />
    </>
  );
}
