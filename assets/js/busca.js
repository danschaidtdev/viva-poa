const pastaEstabelecimentos = "/viva-poa/estabelecimentos/";
const arquivosEstabelecimentos = [
  "pizza_broto.html",
  "lanche_pampa.html",
 
  //  Adicione aqui o nome de todos os arquivos manualmente ou com backend automático.
];

document.getElementById("botao-busca").addEventListener("click", () => {
  const termo = document.getElementById("busca").value.toLowerCase();
  buscarMetaTags(termo);
});

function buscarPorCategoria(categoria) {
  buscarMetaTags(categoria.toLowerCase());
}

function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos.sort(() => 0.5 - Math.random()).slice(0, 3);
  buscarMetaTags('', aleatorios);
}

async function buscarMetaTags(filtro, listaEspecifica = null) {
  const container = document.getElementById("resultados");
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

      const conteudo = `${title} ${desc}`.toLowerCase();

      if (conteudo.includes(filtro)) {
        resultados.push({ titulo: title, descricao: desc, link: pastaEstabelecimentos + arquivo });
      }
    } catch (e) {
      console.warn(`Erro ao buscar ${arquivo}:`, e);
    }
  }

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (resultados.length === 0) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  resultados.forEach(r => {
    const card = document.createElement("div");
    card.classList.add("card-resultado");
    card.innerHTML = `
      <h2>${r.titulo}</h2>
      <p>${r.descricao}</p>
      <a href="${r.link}" target="_blank">Ver mais</a>
    `;
    container.appendChild(card);
  });
}
