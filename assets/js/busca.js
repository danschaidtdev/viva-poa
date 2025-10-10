const pastaEstabelecimentos = "/viva-poa/estabelecimentos/";
const arquivosEstabelecimentos = [
  "pizza_broto.html",
  "papa-lanches-e-pizzas.html",
  // Adicione outros arquivos aqui
];

window.addEventListener("DOMContentLoaded", () => {
  mostrarAleatorios();

  const botaoBusca = document.getElementById("botao-busca");
  const campoBusca = document.getElementById("busca");
  const btnSomenteAbertos = document.getElementById("somente-abertos");

  if (botaoBusca && campoBusca) {
    botaoBusca.addEventListener("click", () => {
      const termo = campoBusca.value.toLowerCase();
      buscarMetaTags(termo, btnSomenteAbertos?.dataset.active === "true");
    });
  }

  if (btnSomenteAbertos) {
    btnSomenteAbertos.addEventListener("click", () => {
      const ativo = btnSomenteAbertos.dataset.active === "true";
      btnSomenteAbertos.dataset.active = ativo ? "false" : "true";
      btnSomenteAbertos.classList.toggle("ativo", !ativo);

      const termo = campoBusca?.value.toLowerCase() || "";
      buscarMetaTags(termo, !ativo);
    });
  }
});

// ------------------------
// BUSCA POR CATEGORIA
// ------------------------
function buscarPorCategoria(categoria) {
  const btnSomenteAbertos = document.getElementById("somente-abertos");
  buscarMetaTags(categoria.toLowerCase(), btnSomenteAbertos?.dataset.active === "true");
}

// ------------------------
// MOSTRAR ALEATÓRIOS
// ------------------------
function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const btnSomenteAbertos = document.getElementById("somente-abertos");
  buscarMetaTags("", btnSomenteAbertos?.dataset.active === "true", aleatorios);
}

// ------------------------
// FUNÇÃO DE BUSCA PRINCIPAL
// ------------------------
async function buscarMetaTags(filtro, apenasAbertos = false, listaEspecifica = null) {
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

      const jsonLd = doc.querySelector("script[type='application/ld+json']")?.textContent;
      const status = calcularStatus(jsonLd);

      if ((conteudo.includes(filtro) || filtro === "") && (!apenasAbertos || status === "Aberto agora")) {
        resultados.push({
          titulo: title,
          descricao: desc,
          imagem,
          link: pastaEstabelecimentos + arquivo,
          status,
        });
      }
    } catch (e) {
      console.warn(`Erro ao buscar ${arquivo}:`, e);
    }
  }

  mostrarResultados(resultados);
}

// ------------------------
// MOSTRAR RESULTADOS
// ------------------------
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

    const statusClass =
      r.status === "Aberto agora"
        ? "status-aberto"
        : r.status === "Fechado agora"
        ? "status-fechado"
        : "status-indisponivel";

    card.innerHTML = `
      <img src="${r.imagem}" alt="${r.titulo}" class="imagem-resultado" />
      <h2>${r.titulo} <span class="${statusClass}">${r.status}</span></h2>
      <p>${r.descricao}</p>
      <a href="${r.link}" target="_blank">Ver mais</a>
    `;

    container.appendChild(card);
  });
}

// ------------------------
// FUNÇÃO DE CÁLCULO DE STATUS
// ------------------------
function calcularStatus(jsonLdText) {
  if (!jsonLdText) return "Indisponível";

  try {
    const dados = JSON.parse(jsonLdText);
    const horarios = Array.isArray(dados.openingHoursSpecification)
      ? dados.openingHoursSpecification
      : [dados.openingHoursSpecification];

    const agora = new Date();
    const diaSemana = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][agora.getDay()];
    const horaAtual = agora.getHours() + agora.getMinutes() / 60;

    const abertoAgora = horarios.some((oh) => {
      const dias = Array.isArray(oh.dayOfWeek) ? oh.dayOfWeek : [oh.dayOfWeek];
      if (!dias.includes(diaSemana)) return false;

      const [hA, mA] = oh.opens.split(":").map(Number);
      const [hF, mF] = oh.closes.split(":").map(Number);
      const abre = hA + mA / 60;
      const fecha = hF + mF / 60;

      // Horários que passam da meia-noite
      if (fecha < abre) return horaAtual >= abre || horaAtual < fecha;
      return horaAtual >= abre && horaAtual < fecha;
    });

    return abertoAgora ? "Aberto agora" : "Fechado agora";
  } catch (e) {
    console.warn("Erro ao interpretar JSON-LD:", e);
    return "Indisponível";
  }
}
