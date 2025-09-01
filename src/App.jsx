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
  const [ordemPreco, setOrdemPreco] = useState('nenhum');
  const [loading, setLoading] = useState(true); // spinner

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const fecharCarrinho = () => setCarrinhoAberto(false);

  // Carregar catálogo de produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        let res = await fetch('/produtos.json');
        if (!res.ok) throw new Error('sem local');
        let data = await res.json();
        normalizar(data);
      } catch {
        try {
          const urlRemota =
            'https://raw.githubusercontent.com/CP-WebDevelopment/produtosEcoTrend/main/produtos.json';
          let res = await fetch(urlRemota);
          let data = await res.json();
          normalizar(data);
        } catch (e) {
          console.error('Falha ao carregar produtos:', e);
        }
      } finally {
        setLoading(false); // remove spinner
      }
    };
    fetchProdutos();
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

  // Carregar carrinho do localStorage
  useEffect(() => {
    const carrinhoLS = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(carrinhoLS);
  }, []);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const existe = prev.find((p) => p.id === produto.id);
      let novoCarrinho;
      if (existe) {
        novoCarrinho = prev.map((p) =>
          p.id === produto.id ? { ...p, qtd: (p.qtd || 1) + 1 } : p
        );
      } else {
        novoCarrinho = [...prev, { ...produto, qtd: 1 }];
      }
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  // Remover produto do carrinho
  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;
      let novoCarrinho;
      if (item.qtd > 1) {
        novoCarrinho = prev.map((p) =>
          p.id === id ? { ...p, qtd: p.qtd - 1 } : p
        );
      } else {
        novoCarrinho = prev.filter((p) => p.id !== id);
      }
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem('carrinho');
  };

  // Total do carrinho
  const total = useMemo(
    () =>
      carrinho.reduce(
        (acc, i) => acc + (i.precoNumber || parseValor(i.valor || i.preco)) * (i.qtd || 1),
        0
      ),
    [carrinho]
  );

  const categorias = useMemo(() => {
    const s = new Set(produtosCatalogo.map((p) => p.categoria).filter(Boolean));
    return ['Todos', ...Array.from(s)];
  }, [produtosCatalogo]);

  const produtosFiltrados = useMemo(() => {
    let lista = [...produtosCatalogo];
    if (categoriaSelecionada !== 'Todos')
      lista = lista.filter((p) => p.categoria === categoriaSelecionada);
    if (ordemPreco === 'asc') lista.sort((a, b) => a.precoNumber - b.precoNumber);
    if (ordemPreco === 'desc') lista.sort((a, b) => b.precoNumber - a.precoNumber);
    return lista;
  }, [produtosCatalogo, categoriaSelecionada, ordemPreco]);

  // Função de checkout assíncrono
  const finalizarCompra = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sucesso = Math.random() > 0.1; // 90% chance de sucesso
        if (sucesso) resolve('Compra finalizada com sucesso! 🎉');
        else reject('Erro ao processar a compra. 😢');
      }, 2000); // simula tempo de processamento
    });
  };

  const onFinalizarCompra = async () => {
    try {
      alert('Processando pedido...');
      const msg = await finalizarCompra();
      alert(msg);
      limparCarrinho();
      fecharCarrinho();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Header
        abrirCarrinho={abrirCarrinho}
        itensCarrinho={carrinho.reduce((a, i) => a + (i.qtd || 1), 0)}
      />

      <main className="container">
        {loading ? (
          <div className="spinner">Carregando produtos...</div>
        ) : (
          <Produtos
            produtos={produtosFiltrados}
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            setCategoriaSelecionada={setCategoriaSelecionada}
            ordemPreco={ordemPreco}
            setOrdemPreco={setOrdemPreco}
            onAdicionar={adicionarAoCarrinho}
          />
        )}
      </main>

      <Carrinho
        aberto={carrinhoAberto}
        fechar={fecharCarrinho}
        itens={carrinho}
        total={total}
        onRemover={removerDoCarrinho}
        onFinalizar={onFinalizarCompra}
      />

      <Footer />
    </>
  );
}
