function exibirAgendamentos() {
    const containerAgendamentos = document.querySelector('.agendamentos');
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const voltarButton = document.querySelector('.voltar-button');

    if (eventos.length === 0) {
        containerAgendamentos.innerHTML = '<p>Não há eventos agendados.</p>';
    } else {
        containerAgendamentos.innerHTML = ''; // Limpa o conteúdo anterior

        eventos.forEach((evento, index) => {
            const eventoHTML = `
                <div class="agendamento">
                    <span class="excluir-button" data-index="${index}">&times;</span>
                    <h3>${evento.nome}</h3>
                    <p><strong>Tipo:</strong> ${evento.tipo}</p>
                    <p><strong>Disponibilidade de Ingressos:</strong> ${evento.disponibilidade}</p>
                    <button class="detalhes-button" data-index="${index}">Ver detalhes</button>
                </div>
            `;
            containerAgendamentos.insertAdjacentHTML('beforeend', eventoHTML);
        });

        const detalhesButtons = document.querySelectorAll('.detalhes-button');
        detalhesButtons.forEach(button => {
            button.addEventListener('click', mostrarDetalhes);
        });

        const excluirButtons = document.querySelectorAll('.excluir-button');
        excluirButtons.forEach(button => {
            button.addEventListener('click', excluirEvento);
        });
    }

    // Sempre exibe o botão voltar-button
    voltarButton.style.display = 'block';
}

function mostrarDetalhes(event) {
    const index = event.target.dataset.index;
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos[index];
    const modalDetails = document.getElementById('modal-details');
    modalDetails.innerHTML = `
        ${evento.banner ? `<img src="${evento.banner}" alt="Banner do Evento" class="banner-img">` : ''}
        <p><strong>Nome:</strong> ${evento.nome}</p>
        <p><strong>Data:</strong> ${evento.data}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Tipo:</strong> ${evento.tipo}</p>
        <p><strong>Público-Alvo:</strong> ${evento.publico}</p>
        <p><strong>Capacidade Máxima:</strong> ${evento.capacidade}</p>
        <p><strong>Preço do Ingresso:</strong> ${evento.preco}</p>
        <p><strong>Disponibilidade de Ingressos:</strong> ${evento.disponibilidade}</p>
        <br>
        <h2>Programações</h2>
        <br>
        ${evento.programacoes.map(prog => `
            <div class="programacao">
                <p><strong>Horário:</strong> ${prog.horario}</p>
                <p><strong>Descrição da Atividade:</strong> ${prog.descricaoAtividade}</p>
                <p><strong>Palestrante/Responsável:</strong> ${prog.responsavel}</p>
            </div>
        `).join('')}
    `;
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const comprarButton = document.querySelector('.comprar-button');
    comprarButton.dataset.index = index; 
    comprarButton.addEventListener('click', comprarIngresso);
}

// VerificarAgenda.js

function mostrarPagamento(index) {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos[index];

    const modal = document.getElementById('modal');
    modal.style.display = 'none';

    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'block';

    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('total-price');

    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value) || 0;
        const totalPrice = quantity * evento.preco;
        totalPriceElement.textContent = `Preço Total: R$ ${totalPrice.toFixed(2)}`;
    });

    const closePaymentButton = document.querySelector('.close-payment-button');
    closePaymentButton.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const quantity = parseInt(quantityInput.value);

        if (quantity > evento.disponibilidade) {
            alert('Quantidade de ingressos solicitada excede a disponibilidade.');
        } else {
            evento.disponibilidade -= quantity;
            localStorage.setItem('eventos', JSON.stringify(eventos));

            // Despacha evento personalizado
            const compraEvent = new CustomEvent('compraRealizada', {
                detail: {
                    nomeEvento: evento.nome,
                    quantidadeIngressos: quantity,
                    valorTotal: quantity * evento.preco
                }
            });
            document.dispatchEvent(compraEvent);

            alert('Compra realizada com sucesso!');
            paymentModal.style.display = 'none';
            exibirAgendamentos();
        }
    });
}




function comprarIngresso(event) {
    const index = event.target.dataset.index;
    mostrarPagamento(index);
}

function excluirEvento(event) {
    const index = event.target.dataset.index;
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos.splice(index, 1);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    exibirAgendamentos();
}

document.addEventListener('DOMContentLoaded', () => {
    exibirAgendamentos();
});
