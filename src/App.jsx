import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Carrinho from './components/Carrinho';
import Produto from './components/Produtos';
import './css/global.css';
import './css/estilo.css';
import './css/produto.css';

function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosCatalogo, setProdutosCatalogo] = useState([]);

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const fecharCarrinho = () => setCarrinhoAberto(false);

  // Carrega produtos do JSON do GitHub
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/CP-WebDevelopment/produtosEcoTrend/main/produtos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao acessar API');
        return res.json();
      })
      .then((data) => setProdutosCatalogo(data))
      .catch((err) => console.error(err));
  }, []);

  // Carrega produtos do localStorage (carrinho)
  useEffect(() => {
    const carrinhoLS = JSON.parse(localStorage.getItem('carrinho')) || [];
    setProdutos(carrinhoLS);
  }, []);

  // Função para adicionar produto ao carrinho
  const adicionarCarrinho = (produto) => {
    const carrinhoLS = [...produtos];
    const existe = carrinhoLS.find((item) => item.id === produto.id);

    if (existe) {
      existe.quantidade += 1;
    } else {
      carrinhoLS.push({ ...produto, quantidade: 1 });
    }

    setProdutos(carrinhoLS);
    localStorage.setItem('carrinho', JSON.stringify(carrinhoLS));
  };

  return (
    <div>
      {/* Header com badge */}
      <Header abrirCarrinho={abrirCarrinho} quantidade={produtos.length} />

      {/* Conteúdo principal */}
      <main style={{ padding: '20px' }}>
        <h2>Bem-vindo à EcoTrend!</h2>
        <p>Confira nossos produtos sustentáveis:</p>

        <div className="catalogo">
          {produtosCatalogo.map((prod) => (
            <Produto key={prod.id} produto={prod} adicionarCarrinho={adicionarCarrinho} />
          ))}
        </div>
      </main>

      {/* Carrinho */}
      <Carrinho
        aberto={carrinhoAberto}
        fechar={fecharCarrinho}
        produtos={produtos}
        setProdutos={setProdutos}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
