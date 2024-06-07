// Relatorio.js

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('storage', () => {
        carregarRelatorio();
    });

    carregarRelatorio();

    function carregarRelatorio() {
        const relatorioBody = document.querySelector('.relatorio-body');
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        relatorioBody.innerHTML = '';

        let ingressosVendidosTotal = 0;
        let valorArrecadadoTotal = 0;

        eventos.forEach(evento => {
            const capacidade = parseInt(evento.capacidade);
            const disponibilidade = parseInt(evento.disponibilidade);
            const preco = parseFloat(evento.preco);

            if (isNaN(capacidade) || isNaN(disponibilidade) || isNaN(preco)) {
                console.error(`Erro: valores inválidos para evento ${evento.nome}`);
                return;
            }

            let ingressosVendidos = capacidade - disponibilidade;
            ingressosVendidos = Math.max(0, ingressosVendidos);

            const valorArrecadado = ingressosVendidos * preco;

            ingressosVendidosTotal += ingressosVendidos;
            valorArrecadadoTotal += valorArrecadado;

            const rowHTML = `
                <tr>
                    <td>${evento.nome}</td>
                    <td>${ingressosVendidos}</td>
                    <td>R$ ${valorArrecadado.toFixed(2)}</td>
                </tr>
            `;
            relatorioBody.insertAdjacentHTML('beforeend', rowHTML);
        });

        const totalRowHTML = `
            <tr>
                <td>Total</td>
                <td>${ingressosVendidosTotal}</td>
                <td>R$ ${valorArrecadadoTotal.toFixed(2)}</td>
            </tr>
        `;
        relatorioBody.insertAdjacentHTML('beforeend', totalRowHTML);
    }

    // Listener para atualizar relatório quando compra é realizada (usado em mostrarPagamento)
    document.addEventListener('compraRealizada', (event) => {
        const { nomeEvento, quantidadeIngressos, valorTotal } = event.detail;

        // Atualiza o evento específico no relatório
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        const eventoAtualizado = eventos.find(evento => evento.nome === event.detail.nomeEvento);

        if (eventoAtualizado) {
            eventoAtualizado.disponibilidade -= quantidadeIngressos;
            localStorage.setItem('eventos', JSON.stringify(eventos));
            carregarRelatorio(); // Atualiza o relatório após a compra
        }
    });
});