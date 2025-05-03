document.addEventListener('DOMContentLoaded', () => {

  console.log("MENSAGEM: Força para aceitar as coisas que não posso mudar e coragem para mudar as que posso.")
  //alert("Arquivo JS carregado com sucesso!") //ALERTA POP-UP

  // Seleciona todos os botões com a classe 'toggle-btn'
  document.querySelectorAll('.toggle-btn').forEach(button => {
    // Adiciona evento de clique em cada botão
    button.addEventListener('click', () => {
      // Encontra o container mais próximo (pai) com a classe 'toggle-container'
      const container = button.closest('.toggle-container');

      // Verifica se o container existe
      if (container) {
        // Alterna a classe 'open' no container para mostrar/ocultar
        container.classList.toggle('open');

        // Atualiza atributo de acessibilidade com base no estado atual
        const isExpanded = container.classList.contains('open');
        button.setAttribute('aria-expanded', isExpanded);
      } else {
        console.error('Container não encontrado!');
      }
    });
  });


  // SEÇÃO PRODUTOS
  function toggleDescricao(btn) {
    const descricao = btn.nextElementSibling;
    const isVisible = descricao.style.display === "block";
    descricao.style.display = isVisible ? "none" : "block";
  }


  // EFEIT LANDING PAGE
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


  // BANNER ANIMADO COM TEXTO
  const termos = ["o papo", "o sono", "as séries", "as risadas", "as viagens", "a administração", "o marketing", "o design", "a divulgação", ];
  let index = 0;
  const termoSpan = document.getElementById("termo");

  setInterval(() => {
    index = (index + 1) % termos.length;

    // Reinicia a animação
    termoSpan.classList.remove("slide-up");
    void termoSpan.offsetWidth; // força o reflow para reiniciar a animação

    termoSpan.textContent = termos[index];
    termoSpan.classList.add("slide-up");
  }, 1500);


  // GALERIA DE IMAGENS
  function scrollGaleria(direction) {
    const galeria = document.getElementById('galeria');
    const scrollAmount = 320; // largura da imagem + margem
    galeria.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

});
