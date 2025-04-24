const botao = document.getElementById("botao-flutuante");
const formulario = document.getElementById("formulario-flutuante");
const formContato = document.getElementById("formContato");
const totalPedido = document.getElementById("totalPedido");

let total = 0; // Inicializa o valor total do pedido

botao.addEventListener("click", () => {
  formulario.classList.toggle("oculto");
});

formContato.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formContato);
  const dados = Object.fromEntries(formData.entries());

  const telefone = '5551992671278'; // Substitua pelo seu número com DDI e DDD
  const texto = `Olá! Meu nome é ${dados.nome} ${dados.sobrenome}, meu pedido é:\n${dados.mensagem}\nTotal: R$ ${total}\nForma de pagamento: ${dados.pagamento}`;

  const urlWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

  // Abre o WhatsApp com os dados preenchidos
  window.open(urlWhatsApp, '_blank');

  formContato.reset();
  formulario.classList.add("oculto");
});

document.getElementById("adicionarPedido").addEventListener("click", () => {
  const prato = document.getElementById("prato").value;
  const quantia = document.getElementById("quantia").value;

  if (prato && quantia) {
    const precoUnitario = 20; // Exemplo de preço fixo por prato
    const totalPrato = precoUnitario * quantia;
    total += totalPrato;

    totalPedido.innerText = `Total: R$ ${total.toFixed(2)}`;

    // Limpa os campos de prato e quantia
    document.getElementById("prato").value = '';
    document.getElementById("quantia").value = '';
  }
});
