const pastaEstabelecimentos = "/viva-poa/estabelecimentos/";
const arquivosEstabelecimentos = [
  "pizza_broto.html",
  "lanche_pampa.html",
  // Adicione outros arquivos aqui
];

// Ao carregar a página, já mostrar aleatórios
window.addEventListener("DOMContentLoaded", () => {
  mostrarAleatorios();

  const botaoBusca = document.getElementById("botao-busca");
  const campoBusca = document.getElementById("busca");

  if (botaoBusca && campoBusca) {
    botaoBusca.addEventListener("click", () => {
      const termo = campoBusca.value.toLowerCase();
      buscarMetaTags(termo);
    });
  }
});

function buscarPorCategoria(categoria) {
  buscarMetaTags(categoria.toLowerCase());
}

function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  buscarMetaTags('', aleatorios);
}

async function buscarMetaTags(filtro, listaEspecifica = null) {
  const container = document.getElementById("resultados");
  if (!container) return;

  container.innerHTML = "<p>Buscando...</p>";

  const lista = listaEspecifica || arquivosEstabelecimentos;
  const resultados = [];

  for (const arquivo of lista) {
    try {
      const resposta = await fetch(pastaEstabelecimentos + arquivo);
      const texto = await resposta.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(texto, "text/html");

      const title = doc.querySelector("meta[property='og:title']")?.content || "Sem título";
      const desc = doc.querySelector("meta[name='description']")?.content || "Sem descrição";
      const imagem =
        doc.querySelector("meta[property='og:image']")?.content ||
        `${location.origin}/viva-poa/assets/midia/logo-viva-poa-site-de-divulgacao-de-estabelecientos-porto-alegre.webp`;

      const conteudo = `${title} ${desc}`.toLowerCase();

      if (conteudo.includes(filtro) || filtro === '') {
        resultados.push({
          titulo: title,
          descricao: desc,
          imagem: imagem,
          link: pastaEstabelecimentos + arquivo,
        });
      }
    } catch (e) {
      console.warn(`Erro ao buscar ${arquivo}:`, e);
    }
  }

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const container = document.getElementById("resultados");
  if (!container) return;

  container.innerHTML = "";

  if (resultados.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Mais resultados em breve!";
    mensagem.style.color = "var(--cor-escura)";
    container.appendChild(mensagem);
    return;
  }

  resultados.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("card-resultado");
    card.innerHTML = `
      <img src="${r.imagem}" alt="${r.titulo}" class="imagem-resultado" />
      <h2>${r.titulo}</h2>
      <p>${r.descricao}</p>
      <a href="${r.link}" target="_blank">Ver mais</a>
    `;
    container.appendChild(card);
  });
}
