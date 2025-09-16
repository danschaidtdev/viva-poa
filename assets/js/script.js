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
    const imagem = galeria.querySelector('img');

    if (!imagem) return;

    const imagemLargura = imagem.offsetWidth;
    const margemDireita = parseInt(getComputedStyle(imagem).marginRight) || 0;

    const scrollAmount = imagemLargura + margemDireita;

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

//BOTAO PISCA
  window.addEventListener('DOMContentLoaded', () => {
    const botao = document.querySelector('.botao-flutuante');
    if (botao) {
      botao.classList.add('piscar');
    }
  });

// STATUS DE OPERAÇÃO

window.addEventListener("DOMContentLoaded", () => {
    mostrarStatusAtual();
});

function mostrarStatusAtual() {
    const statusEl = document.getElementById("status-abertura");
    if (!statusEl) return;

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
    const horaMinuto = `${String(agora.getHours()).padStart(2,"0")}:${String(agora.getMinutes()).padStart(2,"0")}`;

    const jsonLdEl = document.querySelector("script[type='application/ld+json']");
    let status = "Indisponível";

    if (jsonLdEl) {
        try {
            const dados = JSON.parse(jsonLdEl.textContent);

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
            console.warn("Erro ao ler JSON-LD:", e);
        }
    }

    // Atualiza elemento com a classe de status
    statusEl.textContent = status;
    statusEl.className = status === "Aberto agora" ? "status-aberto" :
                         status === "Fechado" ? "status-fechado" :
                         "status-indisponivel";
}
