import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Carrinho from './components/Carrinho';
import Produtos from './components/Produtos';

import './css/global.css';
import './css/estilo.css';
import './css/produto.css';


// Transforma strings em números limpos, tipo "R$ 10,50" vira 10.5
const parseValor = (s) => {
  if (s == null) return 0;
  if (typeof s === 'number') return s;
  return Number(String(s).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

// Tenta adivinhar a categoria do produto pelo nome
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
  // === States principais ===
  const [carrinhoAberto, setCarrinhoAberto] = useState(false); // controla se o carrinho tá aberto
  const [produtosCatalogo, setProdutosCatalogo] = useState([]); // lista de produtos do catálogo
  const [carrinho, setCarrinho] = useState([]); // produtos que o usuário adicionou
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos'); // filtro
  const [ordemPreco, setOrdemPreco] = useState('nenhum'); // ordenação de preço

  // Funções de abrir/fechar carrinho
  const abrirCarrinho = () => setCarrinhoAberto(true);
  const fecharCarrinho = () => setCarrinhoAberto(false);

  // Carregar catálogo de produtos.json
  useEffect(() => {
    fetch('/produtos.json') // tenta carregar JSON local
      .then(r => r.ok ? r.json() : Promise.reject('sem local'))
      .then(normalizar) 
      .catch(() => { // se não tiver pega do Git
        const urlRemota = 'https://raw.githubusercontent.com/CP-WebDevelopment/produtosEcoTrend/main/produtos.json';
        fetch(urlRemota)
          .then(r => r.json())
          .then(normalizar)
          .catch(e => console.error('Falha ao carregar produtos:', e));
      });
  }, []);

  // título, preço e categoria 
  function normalizar(data) {
    const lista = (Array.isArray(data) ? data : []).map((p, i) => {
      const titulo = p.produto ?? p.nome ?? `Produto ${i + 1}`;
      const precoNumber = p.precoNumber ?? parseValor(p.valor ?? p.preco);
      const categoria = p.categoria ?? inferirCategoria(titulo);
      return { ...p, produto: titulo, precoNumber, categoria };
    });
    setProdutosCatalogo(lista);
  }

  // Carregar carrinho localStorage ao iniciar
  useEffect(() => {
    const carrinhoLS = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(carrinhoLS);
  }, []);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const existe = prev.find(p => p.id === produto.id);
      let novoCarrinho;
      if (existe) {
        // se já existe, só aumenta a quantidade
        novoCarrinho = prev.map(p => p.id === produto.id ? { ...p, qtd: (p.qtd || 1) + 1 } : p);
      } else {
        // se não existe, adiciona com quantidade 1
        novoCarrinho = [...prev, { ...produto, qtd: 1 }];
      }
      // salva no localStorage
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  // Remover produto do carrinho 
  const removerDoCarrinho = (id) => {
    setCarrinho(prev => {
      const item = prev.find(p => p.id === id);
      if (!item) return prev;
      let novoCarrinho;
      if (item.qtd > 1) {
        // diminui quantidade
        novoCarrinho = prev.map(p => p.id === id ? { ...p, qtd: p.qtd - 1 } : p);
      } else {
        // remove se qtd = 1
        novoCarrinho = prev.filter(p => p.id !== id);
      }
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  //Limpar carrinho 
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem('carrinho');
  };

  /// Total do carrinho
  const total = useMemo(() =>
    carrinho.reduce((acc, i) => acc + (i.precoNumber || parseValor(i.valor || i.preco)) * (i.qtd || 1), 0),
    [carrinho]
  );

  // Categorias únicas do catálogo (pra filtro)
  const categorias = useMemo(() => {
    const s = new Set(produtosCatalogo.map(p => p.categoria).filter(Boolean));
    return ['Todos', ...Array.from(s)];
  }, [produtosCatalogo]);

  //Produtos filtrados e ordenados
  const produtosFiltrados = useMemo(() => {
    let lista = [...produtosCatalogo];
    if (categoriaSelecionada !== 'Todos') lista = lista.filter(p => p.categoria === categoriaSelecionada);
    if (ordemPreco === 'asc') lista.sort((a,b) => a.precoNumber - b.precoNumber);
    if (ordemPreco === 'desc') lista.sort((a,b) => b.precoNumber - a.precoNumber);
    return lista;
  }, [produtosCatalogo, categoriaSelecionada, ordemPreco]);

  //Renderiza
  return (
    <>
      <Header 
        abrirCarrinho={abrirCarrinho} 
        itensCarrinho={carrinho.reduce((a,i) => a + (i.qtd || 1), 0)} 
      />
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
        onFinalizar={() => { alert('Compra finalizada! 🎉'); limparCarrinho(); fecharCarrinho(); }}
      />
      <Footer />
    </>
  );
}
