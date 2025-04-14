async function buscarMetaTags(filtro) {
  const container = document.getElementById("resultados");
  container.innerHTML = "<p>Buscando...</p>";

  const resposta = await fetch("../Viva CB/assets/js/estabelecimentos.json");
  const arquivos = await resposta.json();

  const resultados = [];

  for (const arquivo of arquivos) {
    try {
      const resposta = await fetch(`/estabelecimento/${arquivo}`);
      const texto = await resposta.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(texto, "text/html");

      const title = doc.querySelector("meta[property='og:title']")?.content || "Sem título";
      const desc = doc.querySelector("meta[name='description']")?.content || "Sem descrição";

      const conteudo = `${title} ${desc}`.toLowerCase();

      if (conteudo.includes(filtro)) {
        resultados.push({ titulo: title, descricao: desc, link: `/estabelecimento/${arquivo}` });
      }
    } catch (e) {
      console.warn(`Erro ao buscar ${arquivo}:`, e);
    }
  }

  mostrarResultados(resultados);
}
