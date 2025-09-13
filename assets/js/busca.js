const pastaEstabelecimentos = "/viva-poa/estabelecimentos/";
const arquivosEstabelecimentos = [
  "pizza_broto.html",
  "papa-lanches-e-pizzas.html",
  // Adicione outros arquivos aqui
];

// Verifica se está aberto
function estaAberto(abertura, fechamento, dias) {
  const agora = new Date();
  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours() * 60 + agora.getMinutes();

  if (!dias.includes(diaAtual)) return false;

  const [hAbr, mAbr] = abertura.split(":").map(Number);
  const [hFech, mFech] = fechamento.split(":").map(Number);
  let aberturaMin = hAbr * 60 + mAbr;
  let fechamentoMin = hFech * 60 + mFech;
  let agoraMin = horaAtual;

  if (fechamentoMin <= aberturaMin) fechamentoMin += 24 * 60; // passa da meia-noite
  if (agoraMin < aberturaMin) agoraMin += 24 * 60;

  return agoraMin >= aberturaMin && agoraMin <= fechamentoMin;
}

// Busca por meta tags + filtro de horário
async function buscarMetaTags(filtro = '', listaEspecifica = null) {
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

      const est = doc.querySelector(".estabelecimento");
      const title = doc.querySelector("meta[property='og:title']")?.content || "Sem título";
      const desc = doc.querySelector("meta[name='description']")?.content || "Sem descrição";
      const imagem = doc.querySelector("meta[property='og:image']")?.content ||
                     `${location.origin}/viva-poa/assets/midia/logo-viva-poa-site-de-divulgacao-de-estabelecientos-porto-alegre.webp`;

      // Filtro horário e dias
      const dias = (est?.dataset.dias || "").split(",").map(Number);
      const abertura = est?.dataset.abertura || "00:00";
      const fechamento = est?.dataset.fechamento || "23:59";

      if (!estaAberto(abertura, fechamento, dias)) continue;

      const conteudo = `${title} ${desc}`.toLowerCase();
      if (conteudo.includes(filtro.toLowerCase()) || filtro === '') {
        resultados.push({titulo: title, descricao: desc, imagem, link: pastaEstabelecimentos + arquivo});
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

  resultados.forEach(r => {
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

// Mostra aleatórios ao carregar
window.addEventListener("DOMContentLoaded", () => {
  mostrarAleatorios();
  setInterval(() => buscarMetaTags(), 60000); // atualiza a cada minuto
});

function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos.sort(() => 0.5 - Math.random()).slice(0, 3);
  buscarMetaTags('', aleatorios);
}
