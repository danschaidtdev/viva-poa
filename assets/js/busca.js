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
      // Alterna estado do botão
      btnSomenteAbertos.dataset.active = btnSomenteAbertos.dataset.active === "true" ? "false" : "true";
      const termo = campoBusca?.value.toLowerCase() || '';
      buscarMetaTags(termo, btnSomenteAbertos.dataset.active === "true");
    });
  }
});

function buscarPorCategoria(categoria) {
  const btnSomenteAbertos = document.getElementById("somente-abertos");
  buscarMetaTags(categoria.toLowerCase(), btnSomenteAbertos?.dataset.active === "true");
}

function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const btnSomenteAbertos = document.getElementById("somente-abertos");
  buscarMetaTags('', btnSomenteAbertos?.dataset.active === "true", aleatorios);
}

async function buscarMetaTags(filtro, apenasAbertos = false, listaEspecifica = null) {
  const container = document.getElementById("resultados");
  if (!container) return;

  container.innerHTML = "<p>Buscando...</p>";

  const lista = listaEspecifica || arquivosEstabelecimentos;
  const resultados = [];

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
  const horaMinuto = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

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

      // Analisa JSON-LD
      const jsonLd = doc.querySelector("script[type='application/ld+json']")?.textContent;
      let status = "Indisponível"; // padrão

      if (jsonLd) {
        try {
          const dados = JSON.parse(jsonLd);
          if (dados.openingHoursSpecification) {
            const abertoAgora = dados.openingHoursSpecification.some((oh) => {
              const dias = Array.isArray(oh.dayOfWeek) ? oh.dayOfWeek : [oh.dayOfWeek];
              if (!dias.includes(diaSemana)) return false;

              let fecha = oh.closes;
              let horaAtual = horaMinuto;

              // Ajuste para horários que passam da meia-noite
              if (fecha < oh.opens) {
                if (horaAtual < oh.opens) {
                  horaAtual = ("24:" + horaAtual).slice(-5);
                }
                fecha = ("24:" + fecha).slice(-5);
              }

              return horaAtual >= oh.opens && horaAtual <= fecha;
            });

            status = abertoAgora ? "Aberto agora" : "Fechado";
          }
        } catch (e) {
          console.warn("Erro ao parsear JSON-LD:", e);
        }
      }

      if ((conteudo.includes(filtro) || filtro === '') && (!apenasAbertos || status === "Aberto agora")) {
        resultados.push({
          titulo: title,
          descricao: desc,
          imagem: imagem,
          link: pastaEstabelecimentos + arquivo,
          status: status
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

    const statusClass = r.status === "Aberto agora" ? "status-aberto" :
                        r.status === "Fechado" ? "status-fechado" :
                        "status-indisponivel";

    card.innerHTML = `
      <img src="${r.imagem}" alt="${r.titulo}" class="imagem-resultado" />
      <h2>${r.titulo} <span class="${statusClass}">${r.status}</span></h2>
      <p>${r.descricao}</p>
      <a href="${r.link}" target="_blank">Ver mais</a>
    `;

    container.appendChild(card);
  });
}
