document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/imunizacoes';
    const vaccineOptionsUrl = 'http://localhost:3000/vacinas';
    const immunizationForm = document.getElementById('immunizationForm');
    const immunizationList = document.getElementById('immunizationList');
    const vaccineSelect = document.getElementById('vaccine');

    function isValidCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); 

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }

        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }

        return remainder === parseInt(cpf.substring(10, 11));
    }

    function listImmunizations() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                immunizationList.innerHTML = '';
                data.forEach(immunization => {
                    const li = document.createElement('li');
                    li.textContent = `${immunization.name} - ${immunization.vaccine} (${immunization.date}, CPF: ${immunization.cpf})`;
                    immunizationList.appendChild(li);
                });
            })
            .catch(error => console.error('Erro ao listar as imunizações:', error));
    }

    function fillVaccineOptions() {
        fetch(vaccineOptionsUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Opções de vacina recebidas:', data);
                vaccineSelect.innerHTML = '<option value="" disabled selected>Selecione uma vacina</option>';
                data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase();
                    optionElement.textContent = option;
                    vaccineSelect.appendChild(optionElement);
                });
                console.log('Opções de vacina preenchidas com sucesso.');
            })
            .catch(error => console.error('Erro ao obter as opções de vacina:', error));
    }

    immunizationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(immunizationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (!isValidCPF(data.cpf)) {
            alert('Digite um CPF válido.');
            return;
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(() => {
            listImmunizations();
            immunizationForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar a imunização:', error));
    });

    listImmunizations();
    fillVaccineOptions();
});
