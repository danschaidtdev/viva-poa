function criarPopup({ id, delayAbertura = 0, tempoFechamento = null, expiraEm = null }) {
  const popup = document.getElementById(id);
  const btnFechar = popup.querySelector('.botaoPopup');

  // Garante que o popup esteja escondido (precaução extra)
  popup.style.display = 'none';

  // Verifica se já expirou
  if (expiraEm) {
    const agora = new Date();
    const dataExpiracao = new Date(expiraEm);
    if (agora > dataExpiracao) {
      console.log('Popup expirado.');
      return;
    }
  }

  // Abrir popup após o delay
  const abrirPopup = () => {
    popup.style.display = 'flex';

    if (tempoFechamento) {
      setTimeout(() => {
        popup.style.display = 'none';
      }, tempoFechamento);
    }
  };

  // Só executa depois do delay de abertura
  setTimeout(abrirPopup, delayAbertura);

  // Botão fechar
  btnFechar.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Tecla para fechar
  btnFechar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      popup.style.display = 'none';
    }
  });
}


criarPopup({
  id: 'popupInicio',
  delayAbertura: 5000, // 3 segundos para abrir
  //tempoFechamento: 10000, // 10 segundos para fechar (opcional)
  //expiraEm: '2025-04-10T00:00:00' // só aparece até essa data (opcional)
});
