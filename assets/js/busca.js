// busca.js
const paginas = [
  '../Viva CB/estabelecimentos/pizza_broto.html',
  '../Viva CB/estabelecimentos/lanche_pampa.html',
  // adicione outras páginas aqui
];

function extrairMetasDoHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  return {
    nome: doc.querySelector('meta[name="nome"]')?.content || '',
    categoria: doc.querySelector('meta[name="categoria"]')?.content || '',
    bairro: doc.querySelector('meta[name="bairro"]')?.content || '',
    rua: doc.querySelector('meta[name="rua"]')?.content || '',
    descricao: doc.querySelector('meta[name="descricao"]')?.content || ''
  };
}

async function carregarDadosMeta() {
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = 'Carregando...';

  const dados = [];

  for (const url of paginas) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const metaInfo = extrairMetasDoHTML(text);
      dados.push(metaInfo);
    } catch (error) {
      console.error(`Erro ao carregar ${url}:`, error);
    }
  }

  mostrarResultados(dados);
}

function mostrarResultados(dados) {
  const container = document.getElementById('resultados');
  container.innerHTML = '';

  dados.forEach(info => {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    div.innerHTML = `
      <h2>${info.nome}</h2>
      <p><strong>Categoria:</strong> ${info.categoria}</p>
      <p><strong>Bairro:</strong> ${info.bairro}</p>
      <p><strong>Rua:</strong> ${info.rua}</p>
      <p>${info.descricao}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById('botao-busca').addEventListener('click', carregarDadosMeta);
