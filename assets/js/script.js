console.log("MENSAGEM: Força para aceitar as coisas que não posso mudar e coragem para mudar as que posso.")
//alert("Arquivo JS carregado com sucesso!") //ALERTA POP-UP

// Seleciona todos os botões com a classe 'toggle-btn'
document.querySelectorAll('.toggle-btn').forEach(button => {
  // Adiciona evento de clique em cada botão
  button.addEventListener('click', () => {
    // Encontra o container mais próximo (pai) com a classe 'toggle-container'
    const container = button.closest('.toggle-container');

    // Alterna a classe 'open' no container para mostrar/ocultar
    container.classList.toggle('open');

    // Atualiza atributo de acessibilidade com base no estado atual
    const isExpanded = container.classList.contains('open');
    button.setAttribute('aria-expanded', isExpanded);
  });
});

// SEÇÃO PRODUTOS
function toggleDescricao(btn) {
  const descricao = btn.nextElementSibling;
  const isVisible = descricao.style.display === "block";
  descricao.style.display = isVisible ? "none" : "block";
}

// EFEITO LANDING PAGE
const elementosAnimados = document.querySelectorAll('.animar');

const observer = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      const el = entrada.target;
      const delay = el.getAttribute('data-delay') || '0s';
      el.style.setProperty('--delay', delay);
      el.classList.add('visivel');
      observer.unobserve(el);
    }
  });
}, {
  threshold: 0.1
});

elementosAnimados.forEach((el) => observer.observe(el));

// GALERIA DE IMAGENS
function scrollGaleria(direction) {
  const galeria = document.getElementById('galeria');
  const scrollAmount = 320; // largura da imagem + margem
  galeria.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}


//COPIA CHAVE PARA DOAÇÃO
function copiarChavePix() {
  const chave = "c2d1a43a-70c1-43fc-8b4c-efa051592740";

  navigator.clipboard.writeText(chave).then(() => {
    console.log("Texto copiado com sucesso!"); // Veja no console do navegador
    const popup = document.getElementById("popupPixCopiado"); // Corrigido: getElementById

    popup.classList.add("mostrar");

    setTimeout(() => {
      popup.classList.remove("mostrar");
    }, 2000);
  }).catch((err) => {
    console.error("Erro ao copiar a chave Pix:", err);
  });
}

