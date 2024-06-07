document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const local = document.getElementById('local').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const publico = document.getElementById('publico').value;
    const capacidade = document.getElementById('capacidade').value;
    const preco = document.getElementById('preco').value;
    const disponibilidade = document.getElementById('disponibilidade').value;
    const bannerInput = document.getElementById('banner').files[0];

    const programacoes = [];
    const horarios = document.querySelectorAll('input[name="horario"]');
    const descricoesAtividades = document.querySelectorAll('textarea[name="descricaoAtividade"]');
    const responsaveis = document.querySelectorAll('input[name="responsavel"]');

    horarios.forEach((horario, index) => {
        programacoes.push({
            horario: horario.value,
            descricaoAtividade: descricoesAtividades[index].value,
            responsavel: responsaveis[index].value
        });
    });

    const evento = {
        nome: nome,
        data: data,
        local: local,
        descricao: descricao,
        tipo: tipo,
        publico: publico,
        capacidade: capacidade,
        preco: preco,
        disponibilidade: disponibilidade,
        programacoes: programacoes
    };

    if (bannerInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            evento.banner = e.target.result;
            saveEvent(evento);
        };
        reader.readAsDataURL(bannerInput);
    } else {
        saveEvent(evento);
    }

    function saveEvent(evento) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos.push(evento);
        localStorage.setItem('eventos', JSON.stringify(eventos));

        document.getElementById('eventForm').reset();
        alert('Evento cadastrado com sucesso!');
        adjustButtonPosition();
    }
});

document.getElementById('btnAdicionarAtividades').addEventListener('click', function() {
    const container = document.getElementById('eventForm');
    const additionalInputs = `
        <label for="horario">Horário do Evento:</label>
        <input type="time" id="horario" name="horario" required>
        
        <label for="descricaoAtividade">Descrição de Atividade:</label>
        <textarea id="descricaoAtividade" name="descricaoAtividade" rows="4" required></textarea>
        
        <label for="responsavel">Palestrante/Responsável:</label>
        <input type="text" id="responsavel" name="responsavel" required>
    `;
    container.insertAdjacentHTML('beforeend', additionalInputs);

    adjustButtonPosition();
});

document.querySelector('.event-form2 button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('eventForm').dispatchEvent(new Event('submit'));
});

function adjustButtonPosition() {
    const main = document.querySelector('main');
    const buttonsContainer = document.querySelector('.button-container');
    const mainHeight = main.scrollHeight;
    main.style.height = `${mainHeight}px`;
}
