const { Client } = require("mqtt");
const { default: handle } = require("mqtt/lib/handlers/index");

const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

client.subscribe("ESP_DATA")

// Função para obter uma variável CSS
function getCssVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

let time = 0;
let ration = 0;
document.getElementById('morning-time').value = "00:02";
document.getElementById('afternoon-time').value = "00:03";
document.getElementById('evening-time').value = "00:04";

//cores definidas no CSS
const rosaclaro = getCssVariable('--Rosa-claro');
const marromrosado = getCssVariable('--Marrom-rosado');
const verdeoliva = getCssVariable('--Verde-oliva');
const verdeescuro = getCssVariable('--Verde-escuro');
const branco = getCssVariable('--Branco');
const pretoazulado = getCssVariable('--Preto-azulado');
const cinzaclaro = getCssVariable('--Cinza-claro');

console.log(rosaclaro);
console.log(marromrosado);
console.log(verdeoliva);
console.log(verdeescuro);
console.log(branco);
console.log(pretoazulado);
console.log(cinzaclaro);

function hideinfo(btn) {
    document.getElementById(`schedule-${btn}-form`).style.display = 'none';
    document.getElementById(`edit-${btn}-button`).style.display = 'none';
}

function showinfosch(btn) {
    document.getElementById(`schedule-${btn}-form`).style.display = 'block';
    document.getElementById(`edit-${btn}-button`).style.display = 'none';
}

function showinfoedit(btn) {
    document.getElementById(`schedule-${btn}-form`).style.display = 'none';
    document.getElementById(`edit-${btn}-button`).style.display = 'block';
}

function decodeID(id) {
    const hours = (id >> 23) & 0x1F;       // Extrai as horas
    const minutes = (id >> 17) & 0x3F;     // Extrai os minutos
    const extra = id & 0x1FFFF;            // Extrai o valor extra

    return {
        hours: hours,
        minutes: minutes,
        extra: extra
    };
}

// Initial Setup
//hideinfo('time');
//hideinfo('ration');

const Handler = function (topic, msg) {
    var msgstr = decoder.decode(message);

    console.log(msgstr)

    if (topic == 'ESP_DATA' && msgstr.startsWith("ACK_TM")) {
        console.log("TESTE1")
        ReconstructGraph(msgstr)
    }
}

function request() {
    client.on("message", Handler);
    client.publish("ESP_COMMAND", "RETURNSCH");
}


// Função para salvar horários
document.getElementById('schedule-time-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const morningTime = document.getElementById('morning-time').value;
    const afternoonTime = document.getElementById('afternoon-time').value;
    const eveningTime = document.getElementById('evening-time').value;

    alert(`Horários de alimentação salvos:\nManhã: ${morningTime}\nTarde: ${afternoonTime}\nNoite: ${eveningTime}`);

    // Mostrar botão de editar e ocultar o formulário
    showinfoedit('time')

    jgesjgo((morningTime, afternoonTime, eveningTime));
});

// Função para editar horários
document.getElementById('edit-time-button').addEventListener('click', function () {
    showinfosch('time')
});

// Função para salvar ração
document.getElementById('schedule-ration-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const morningRation = document.getElementById('morning-ration').value;
    const afternoonRation = document.getElementById('afternoon-ration').value;
    const eveningRation = document.getElementById('evening-ration').value;

    alert(`Quantidades de ração salvas:\nManhã: ${morningRation}g\nTarde: ${afternoonRation}g\nNoite: ${eveningRation}g`);

    // Mostrar botão de editar e ocultar o formulário
    showinfoedit('ration')
});

// Função para editar ração
document.getElementById('edit-ration-button').addEventListener('click', function () {
    showinfosch('ration')
});


// variaveis globais

let nav = 0
let clicked = null
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []


// variavel do modal:
const newEvent = document.getElementById('newEventModal')
const deleteEventModal = document.getElementById('deleteEventModal')
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')
// --------
const calendar = document.getElementById('calendar') // div calendar:
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'] //matriz com dias da semana:

//funções

function openModal(date) {
    clicked = date
    const eventDay = events.find((event) => event.date === clicked)


    if (eventDay) {
        document.getElementById('eventText').innerText = eventDay.title
        deleteEventModal.style.display = 'block'


    } else {
        newEvent.style.display = 'block'

    }

    backDrop.style.display = 'block'
}

//função load() será chamada quando a pagina carregar:

function load() {
    const date = new Date()


    //mudar titulo do mês:
    if (nav !== 0) {
        date.setMonth(new Date().getMonth() + nav)
    }

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()



    const daysMonth = new Date(year, month + 1, 0).getDate()
    const firstDayMonth = new Date(year, month, 1)


    const dateString = firstDayMonth.toLocaleDateString('pt-br', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })


    const paddinDays = weekdays.indexOf(dateString.split(', ')[0])

    //mostrar mês e ano:
    document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`

    calendar.innerHTML = ''
    // criando uma div com os dias:

    for (let i = 1; i <= paddinDays + daysMonth; i++) {
        const dayS = document.createElement('div')
        dayS.classList.add('day')

        const dayString = `${month + 1}/${i - paddinDays}/${year}`

        //condicional para criar os dias de um mês:

        if (i > paddinDays) {
            dayS.innerText = i - paddinDays


            const eventDay = events.find(event => event.date === dayString)

            if (i - paddinDays === day && nav === 0) {
                dayS.id = 'currentDay'
            }


            if (eventDay) {
                const eventDiv = document.createElement('div')
                eventDiv.classList.add('event')
                eventDiv.innerText = eventDay.title
                dayS.appendChild(eventDiv)

            }

            dayS.addEventListener('click', () => openModal(dayString))

        } else {
            dayS.classList.add('padding')
        }

        calendar.appendChild(dayS)
    }
}

function closeModal() {
    eventTitleInput.classList.remove('error')
    newEvent.style.display = 'none'
    backDrop.style.display = 'none'
    deleteEventModal.style.display = 'none'
    eventTitleInput.value = ''
    clicked = null
    load()

}
function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error')
        events.push({
            date: clicked,
            title: eventTitleInput.value
        })

        localStorage.setItem('events', JSON.stringify(events))
        closeModal()

    } else {
        eventTitleInput.classList.add('error')
    }
}

function deleteEvent() {
    events = events.filter(event => event.date !== clicked)
    localStorage.setItem('events', JSON.stringify(events))
    closeModal()
}

// botões 

function buttons() {
    document.getElementById('backButton').addEventListener('click', () => {
        nav--
        load()

    })

    document.getElementById('nextButton').addEventListener('click', () => {
        nav++
        load()

    })

    document.getElementById('saveButton').addEventListener('click', () => saveEvent())
    document.getElementById('cancelButton').addEventListener('click', () => closeModal())
    document.getElementById('deleteButton').addEventListener('click', () => deleteEvent())
    document.getElementById('closeButton').addEventListener('click', () => closeModal())

}
buttons()
load()

request();