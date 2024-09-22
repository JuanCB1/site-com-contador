// Função para obter uma variável CSS
function getCssVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

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

document.getElementById('schedule-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const morningTime = document.getElementById('morning-time').value;
    const afternoonTime = document.getElementById('afternoon-time').value;
    const eveningTime = document.getElementById('evening-time').value;
    alert(`Horários de alimentação salvos:\nManhã: ${morningTime}\nTarde: ${afternoonTime}\nNoite: ${eveningTime}`);

    document.getElementById('schedule-form').style.display = 'none';
    document.getElementById('edit-button').style.display = 'block';
    document.getElementById('cancel-button').style.display = 'block';
});

document.getElementById('edit-button').addEventListener('click', function () {
    document.getElementById('schedule-form').style.display = 'block';
    document.getElementById('edit-button').style.display = 'none';
    document.getElementById('cancel-button').style.display = 'none';
});

document.getElementById('cancel-button').addEventListener('click', function () {
    document.getElementById('schedule-form').style.display = 'none';
    document.getElementById('edit-button').style.display = 'block';
    document.getElementById('cancel-button').style.display = 'none';
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
