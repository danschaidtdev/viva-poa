window.addEventListener("DOMContentLoaded", () => {
    carregarMultiplasAvaliacoes();
  });
  
  async function carregarMultiplasAvaliacoes() {
    const container = document.getElementById("avaliacao-destaque");
    container.innerHTML = "<p>Carregando avaliações...</p>";
  
    const paginasEmbaralhadas = [...arquivosEstabelecimentos].sort(() => 0.5 - Math.random());
    const paginasSelecionadas = paginasEmbaralhadas.slice(0, 6); // até 6 páginas diferentes
  
    const avaliacoes = [];
  
    for (const arquivo of paginasSelecionadas) {
      try {
        const resposta = await fetch(pastaEstabelecimentos + arquivo);
        const texto = await resposta.text();
  
        const parser = new DOMParser();
        const doc = parser.parseFromString(texto, "text/html");
  
        const baloes = doc.querySelectorAll(".baloes-container .balaoMSG");
  
        if (baloes && baloes.length > 0) {
          const balaoAleatorio = baloes[Math.floor(Math.random() * baloes.length)].outerHTML;
          avaliacoes.push(balaoAleatorio);
        }
      } catch (erro) {
        console.warn(`Erro ao buscar avaliação de ${arquivo}:`, erro);
      }
    }
  
    // Exibe os balões encontrados com estrutura intacta
    if (avaliacoes.length > 0) {
      container.innerHTML = '<div class="baloes-container"></div>';
      const baloesContainer = container.querySelector(".baloes-container");
  
      avaliacoes.forEach(html => {
        const div = document.createElement("div");
        div.innerHTML = html.trim(); // remove espaços antes/depois
        const balao = div.firstElementChild;
        if (balao) baloesContainer.appendChild(balao);
      });
    } else {
      container.innerHTML = "<p>Nenhuma avaliação disponível no momento.</p>";
    }
  }
  