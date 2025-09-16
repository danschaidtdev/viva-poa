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
  const filtroAbertos = document.getElementById("filtro-abertos");

  if (botaoBusca && campoBusca) {
    botaoBusca.addEventListener("click", () => {
      const termo = campoBusca.value.toLowerCase();
      buscarMetaTags(termo, filtroAbertos?.checked);
    });
  }

  if (filtroAbertos) {
    filtroAbertos.addEventListener("change", () => {
      const termo = campoBusca?.value.toLowerCase() || '';
      buscarMetaTags(termo, filtroAbertos.checked);
    });
  }
});

function buscarPorCategoria(categoria) {
  const filtroAbertos = document.getElementById("filtro-abertos");
  buscarMetaTags(categoria.toLowerCase(), filtroAbertos?.checked);
}

function mostrarAleatorios() {
  const aleatorios = arquivosEstabelecimentos
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const filtroAbertos = document.getElementById("filtro-abertos");
  buscarMetaTags('', filtroAbertos?.checked, aleatorios);
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
      let abertoAgora = true;
      let horarios = "Horário não disponível";

      if (jsonLd) {
        try {
          const dados = JSON.parse(jsonLd);
          if (dados.openingHoursSpecification) {
            horarios = dados.openingHoursSpecification.map(oh => {
              const dias = Array.isArray(oh.dayOfWeek) ? oh.dayOfWeek.join(", ") : oh.dayOfWeek;
              return `${dias}: ${oh.opens} - ${oh.closes}`;
            }).join(" | ");

            abertoAgora = dados.openingHoursSpecification.some((oh) => {
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
          }
        } catch (e) {
          console.warn("Erro ao parsear JSON-LD:", e);
        }
      }

      if ((conteudo.includes(filtro) || filtro === '') && (!apenasAbertos || abertoAgora)) {
        resultados.push({
          titulo: title,
          descricao: desc,
          imagem: imagem,
          link: pastaEstabelecimentos + arquivo,
          aberto: abertoAgora,
          horarios: horarios
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

    const status = r.aberto
      ? `<span class="status-aberto">Aberto agora</span>`
      : `<span class="status-fechado">Fechado</span>`;

    card.innerHTML = `
      <img src="${r.imagem}" alt="${r.titulo}" class="imagem-resultado" />
      <h2>${r.titulo} ${status}</h2>
      <p>${r.descricao}</p>
      <p class="horarios">${r.horarios}</p>
      <a href="${r.link}" target="_blank">Ver mais</a>
    `;

    container.appendChild(card);
  });
}
