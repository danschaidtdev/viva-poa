window.addEventListener("DOMContentLoaded", () => {
    carregarMultiplasAvaliacoes();
  });
  
  async function carregarMultiplasAvaliacoes() {
    const container = document.getElementById("avaliacao-destaque");
    container.innerHTML = "<p>Carregando avaliações...</p>";
  
    const paginasEmbaralhadas = [...arquivosEstabelecimentos].sort(() => 0.5 - Math.random());
    const paginasSelecionadas = paginasEmbaralhadas.slice(0, 6);
  
    const avaliacoes = [];
  
    for (const arquivo of paginasSelecionadas) {
      try {
        const resposta = await fetch(pastaEstabelecimentos + arquivo);
        const texto = await resposta.text();
  
        const parser = new DOMParser();
        const doc = parser.parseFromString(texto, "text/html");
  
        const baloes = doc.querySelectorAll(".baloes-container .balaoMSG");
        const nomeEstabelecimento = doc.querySelector("meta[property='og:title']")?.content || "Ver Local";
        const linkEstabelecimento = pastaEstabelecimentos + arquivo;
  
        if (baloes && baloes.length > 0) {
          const balaoAleatorio = baloes[Math.floor(Math.random() * baloes.length)].cloneNode(true);
  
          // Criando botão com nome do estabelecimento
          const botao = document.createElement("a");
          botao.href = linkEstabelecimento;
          botao.target = "_blank";
          botao.classList.add("estiloBotao");
          botao.innerText = nomeEstabelecimento;
  
          // Adicionando botão no final do conteúdo
          balaoAleatorio.appendChild(botao);
  
          avaliacoes.push(balaoAleatorio.outerHTML);
        }
      } catch (erro) {
        console.warn(`Erro ao buscar avaliação de ${arquivo}:`, erro);
      }
    }
  
    if (avaliacoes.length > 0) {
      container.innerHTML = '<div class="baloes-container"></div>';
      const baloesContainer = container.querySelector(".baloes-container");
  
      avaliacoes.forEach(html => {
        const div = document.createElement("div");
        div.innerHTML = html.trim();
        const balao = div.firstElementChild;
        if (balao) baloesContainer.appendChild(balao);
      });
    } else {
      container.innerHTML = "<p>Nenhuma avaliação disponível no momento.</p>";
    }
  }
  