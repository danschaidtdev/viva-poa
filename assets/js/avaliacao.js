window.addEventListener("DOMContentLoaded", () => {
    carregarBaloesAleatorios();
  });
  
  async function carregarBaloesAleatorios() {
    const container = document.querySelector(".baloes-container");
    if (!container) return;
  
    container.innerHTML = "<p>Carregando avaliações...</p>";
  
    // Obtém aleatoriamente 3 arquivos do array definido no busca.js
    const aleatorios = arquivosEstabelecimentos.sort(() => 0.5 - Math.random()).slice(0, 3);
    const secoes = [];
  
    for (const arquivo of aleatorios) {
      try {
        const resposta = await fetch(pastaEstabelecimentos + arquivo);
        const texto = await resposta.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(texto, "text/html");
  
        // Alvo: balão de avaliação com classe .animar (ajuste se necessário)
        const balao = doc.querySelector("section.animar");
  
        if (balao) {
          secoes.push(balao.outerHTML);
        }
      } catch (e) {
        console.warn(`Erro ao carregar ${arquivo}:`, e);
      }
    }
  
    if (secoes.length > 0) {
      container.innerHTML = secoes.join('');
    } else {
      container.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
    }
  }
  