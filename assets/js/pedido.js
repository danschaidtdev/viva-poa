let pedido = {};
let categoriaSelecionada = "Doces";

function togglePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
  renderCategorias();
  renderItens();
}

function renderCategorias() {
  const container = document.getElementById("categoryButtons");
  container.innerHTML = "";
  Object.keys(categorias).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-button" + (cat === categoriaSelecionada ? " active" : "");
    btn.textContent = cat;
    btn.onclick = () => {
      categoriaSelecionada = cat;
      renderCategorias();
      renderItens();
    };
    container.appendChild(btn);
  });
}

function renderItens() {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";
  categorias[categoriaSelecionada].forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const qtd = pedido[item.nome] || 0;

    div.innerHTML = `
      <span>${item.nome} - R$ ${item.valor.toFixed(2)}</span>
      <div class="quantity-controls">
        <button onclick="alterarQuantidade('${item.nome}', ${item.valor}, -1)">-</button>
        <span>${qtd}</span>
        <button onclick="alterarQuantidade('${item.nome}', ${item.valor}, 1)">+</button>
      </div>
    `;

    itemsContainer.appendChild(div);
  });
  atualizarTotal();
}

function alterarQuantidade(nome, valor, delta) {
  pedido[nome] = (pedido[nome] || 0) + delta;
  if (pedido[nome] <= 0) delete pedido[nome];
  renderItens();
}

function atualizarTotal() {
  let total = 0;
  Object.keys(pedido).forEach(nome => {
    let valorUnitario;
    for (let cat in categorias) {
      const item = categorias[cat].find(i => i.nome === nome);
      if (item) valorUnitario = item.valor;
    }
    total += (pedido[nome] * valorUnitario);
  });
  document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
}

function nextStep() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
  renderResumoPedido();
}

function prevStep() {
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

function renderResumoPedido() {
  const resumoContainer = document.getElementById("pedidoResumo");
  resumoContainer.innerHTML = "";
  let resumo = "";
  Object.keys(pedido).forEach(nome => {
    resumo += `${nome}: ${pedido[nome]} unidade(s)<br>`;
  });
  const total = Object.keys(pedido).reduce((total, nome) => {
    let valorUnitario;
    for (let cat in categorias) {
      const item = categorias[cat].find(i => i.nome === nome);
      if (item) valorUnitario = item.valor;
    }
    return total + (pedido[nome] * valorUnitario);
  }, 0);
  resumo += `Total: R$ ${total.toFixed(2)}`;
  resumoContainer.innerHTML = resumo;
}

function enviarPedido(event) {
  event.preventDefault();

  // Pega o número do WhatsApp da div com id="popup"
  const numeroWhatsapp = document.getElementById("popup").getAttribute("data-whatsapp");

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const endereco = document.getElementById("endereco").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const pagamento = document.getElementById("pagamento").value;
  const observacao = document.getElementById("observacao").value;

  if (!nome || !endereco || !numero || !bairro || !pagamento) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }
  let mensagem = `*Pedido de ${nome}*%0A`;  // Título com negrito

  Object.keys(pedido).forEach(nome => {
    mensagem += `*${nome}:* ${pedido[nome]} unidade(s)%0A%0A`;  // Negrito no nome do item
  });
  
  const total = (Object.keys(pedido).reduce((t, nome) => {
    for (let cat in categorias) {
      const item = categorias[cat].find(i => i.nome === nome);
      if (item) return t + item.valor * pedido[nome];
    }
    return t;
  }, 0)).toFixed(2);
  
  mensagem += `*Total:* R$ ${total}%0A%0A`;  // Negrito no total com linha vazia depois
  
  // Endereço com emoji e negrito
  mensagem += `>> *Endereço:* ${endereco}, ${numero}, ${bairro}%0A%0A`;
  
  // CPF com emoji
  mensagem += `>> *CPF:* ${cpf}%0A%0A`;
  
  // Forma de Pagamento com emoji e negrito
  mensagem += `>> *Forma de Pagamento:* ${pagamento}%0A%0A`;
  
  // Observação
  mensagem += `>> *Observação:* ${observacao}%0A`;
  
  window.open(`https://wa.me/${numeroWhatsapp}?text=${mensagem}`, "_blank");
}  