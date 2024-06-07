document.addEventListener('DOMContentLoaded', function() {
    const eventSelect = document.getElementById('eventSelect');

    function updateEventOptions(eventSelect) {
        eventSelect.innerHTML = '<option value="">Selecione um evento</option>'; 
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

        if (eventos.length === 0) {
            console.log('Nenhum evento encontrado.');
            return;
        }

        eventos.forEach((evento, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = evento.nome;
            eventSelect.appendChild(option);
        });
    }
    
    updateEventOptions(eventSelect);

    document.getElementById('speakerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const eventIndex = eventSelect.value;
        if (eventIndex === '') {
            alert('Por favor, selecione um evento.');
            return;
        }

        const name = document.getElementById('name').value;
        const bio = document.getElementById('bio').value;
        const topic = document.getElementById('topic').value;
        const presentationDate = document.getElementById('presentationDate').value;
        const presentationTime = document.getElementById('presentationTime').value;
        const infrastructure = document.getElementById('infrastructure').value;

        const photoInput = document.getElementById('photo');
        const photoFile = photoInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const photoURL = e.target.result;

            const speaker = {
                name,
                bio,
                photo: photoURL,
                topic,
                presentationDate,
                presentationTime,
                infrastructure
            };

            const events = JSON.parse(localStorage.getItem('eventos')) || [];
            events[eventIndex].speakers = events[eventIndex].speakers || [];
            events[eventIndex].speakers.push(speaker);

            localStorage.setItem('eventos', JSON.stringify(events));

            document.getElementById('speakerForm').reset();

            alert('Palestrante/Expositor adicionado com sucesso!');
            displaySpeakers(eventIndex);
        };

        reader.readAsDataURL(photoFile);
    });

    eventSelect.addEventListener('change', function() {
        const eventIndex = eventSelect.value;
        displaySpeakers(eventIndex);
    });

    function displaySpeakers(eventIndex) {
        const speakersList = document.getElementById('speakersList');
        speakersList.innerHTML = '';

        if (eventIndex === '') {
            return;
        }

        const events = JSON.parse(localStorage.getItem('eventos')) || [];
        const speakers = events[eventIndex].speakers || [];
        if (speakers.length === 0) {
            speakersList.innerHTML = '<p>Não há palestrantes ou expositores cadastrados para este evento.</p>';
        } else {
            speakers.forEach(speaker => {
                const speakerDiv = document.createElement('div');
                speakerDiv.className = 'speaker';
                speakerDiv.innerHTML = `
                    <h3>${speaker.name}</h3>
                    <img src="${speaker.photo}" alt="${speaker.name}" width="100">
                    <p><strong>Biografia:</strong> ${speaker.bio}</p>
                    <p><strong>Tema:</strong> ${speaker.topic}</p>
                    <p><strong>Data da Apresentação:</strong> ${speaker.presentationDate}</p>
                    <p><strong>Horário da Apresentação:</strong> ${speaker.presentationTime}</p>
                    <p><strong>Infraestrutura:</strong> ${speaker.infrastructure}</p>
                `;
                speakersList.appendChild(speakerDiv);
            });
        }
    }

    const modal = document.getElementById("palestrantesInfo");
    const btnVerPalestrantes = document.getElementById("verPalestrantes");
    const spanClose = document.getElementsByClassName("close")[0];
    const palestrantesContainer = document.getElementById("palestrantesContainer");

    btnVerPalestrantes.onclick = function() {
        modal.style.display = "block";
        displaySpeakersInModal();
    }

    spanClose.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function displaySpeakersInModal() {
        palestrantesContainer.innerHTML = '';
        const eventIndex = eventSelect.value;
        const events = JSON.parse(localStorage.getItem('eventos')) || [];
        
        if (eventIndex === '') {
            const noEventSelectedMessage = document.createElement('p');
            noEventSelectedMessage.textContent = 'Por favor, selecione um evento.';
            palestrantesContainer.appendChild(noEventSelectedMessage);
            return;
        }
    
        const event = events[eventIndex];
    
        const eventTitle = document.createElement('h3');
        eventTitle.textContent = event.nome;
        palestrantesContainer.appendChild(eventTitle);
    
        const speakers = event.speakers || [];
        if (speakers.length === 0) {
            const noSpeakersMessage = document.createElement('p');
            noSpeakersMessage.textContent = 'Não há palestrantes ou expositores cadastrados para este evento.';
            palestrantesContainer.appendChild(noSpeakersMessage);
        } else {
            speakers.forEach(speaker => {
                const speakerDiv = document.createElement('div');
                speakerDiv.className = 'speaker';
                speakerDiv.innerHTML = `
                    <h4>${speaker.name}</h4>
                    <img src="${speaker.photo}" alt="${speaker.name}" width="100">
                    <p><strong>Biografia:</strong> ${speaker.bio}</p>
                    <p><strong>Tema:</strong> ${speaker.topic}</p>
                    <p><strong>Data da Apresentação:</strong> ${speaker.presentationDate}</p>
                    <p><strong>Horário da Apresentação:</strong> ${speaker.presentationTime}</p>
                    <p><strong>Infraestrutura:</strong> ${speaker.infrastructure}</p>
                `;
                palestrantesContainer.appendChild(speakerDiv);
            });
        }
    }
});
