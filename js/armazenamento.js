const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

client.subscribe("DHT_DATA:HUMI");
client.subscribe("DHT_DATA:LEVEL");
client.subscribe("ESP_DATA");

const decoder = new TextDecoder('utf-8');

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

// Configurações globais do Chart.js
// Configurações globais do Chart.js
Chart.defaults.font.family = "'Roboto', sans-serif";
Chart.defaults.color = "#343a40";
Chart.defaults.font.size = 14;

// Função para adicionar dados ao gráfico
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function separateInfoQuery(query) {
    var words = query.split('/');
    var time = words[1].split(':')


    if (words.length >= 2 && time.length >= 3) {
        var result = {
            value: parseFloat(words[0]),
            datetime: {
                hour: parseInt(time[0]),
                minute: parseInt(time[1]),
                second: parseInt(time[2])
            }
        }

        return result;
    }

    return null;
}

function buildDate(datetime) {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), datetime.hour, datetime.minute, datetime.second);
}

// Função para atualizar as informações dos sensores
function getHumidity(info) {
    document.getElementById("sensor-umidade").innerText = info.value + "%";

    addData(Gráficoumidade, buildDate(info.datetime), info.value);

    removeOldData(Gráficoumidade);
}

function getLevel(info) {
    document.getElementById("sensor-nível").innerText = info.value + "%";

    addData(Gráficonível, buildDate(info.datetime), info.value);

    removeOldData(Gráficonível);
}

function ReconstructLevel(data) {
    var keys = data.split(' ');

    for (let index = 1 /* <= On purpose */; index < keys.length; index++) {
        const element = keys[index];
        console.log(element)
        getLevel(separateInfoQuery(element));
    }
}

function ReconstructHumi(data) {
    var keys = data.split(' ');

    for (let index = 1 /* <= On purpose */; index < keys.length; index++) {
        const element = keys[index];
        console.log(element)
        getHumidity(separateInfoQuery(element));
    }
}

let levelReady = false;
let humiReady = false;

const Handler = function (topic, message) {
    var msgstr = decoder.decode(message);

    console.log("PORRA")
    console.log(msgstr)

    if (topic == 'ESP_DATA' && msgstr.startsWith("ACK_LVL")) {
        console.log("TESTE1")
        ReconstructLevel(msgstr)
        levelReady = true;
    }
    else if (topic == 'ESP_DATA' && msgstr.startsWith("ACK_HUMI")) {
        console.log("TESTE2")
        ReconstructHumi(msgstr);
        humiReady = true;
    }

    if (levelReady && humiReady) {
        client.off('message', Handler);
    }
}



// Listener for regular updates for the graph
client.on("message", function (topic, message) {
    var msgstr = decoder.decode(message)
    //console.log(msgstr);

    if (topic === "DHT_DATA:HUMI") {
        getHumidity(separateInfoQuery(msgstr));
    }
    else if (topic === "DHT_DATA:LEVEL") {
        getLevel(separateInfoQuery(msgstr));
    }
})

// Configuração do gráfico de Nível de Alimento
const ctxLevel = document.getElementById("Gráficonível").getContext("2d");
const Gráficonível = new Chart(ctxLevel, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Nível de Alimento (%)",
                data: [],
                borderColor: pretoazulado,
                backgroundColor: pretoazulado + 33,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: pretoazulado,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: pretoazulado,
            },
        ],
    },
    options: {
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "second",
                    displayFormats: {
                        second: "h:mm a",
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: "rgba(200, 200, 200, 0.3)",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#343a40",
                    font: {
                        size: 14,
                    },
                },
            },
        },
    },
});

// Configuração do gráfico de Umidade
const ctxHumidity = document
    .getElementById("Gráficoumidade")
    .getContext("2d");
const Gráficoumidade = new Chart(ctxHumidity, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Umidade (%)",
                data: [],
                borderColor: pretoazulado,
                backgroundColor: pretoazulado + 33,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: pretoazulado,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: pretoazulado,
            },
        ],
    },
    options: {
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "second",
                    displayFormats: {
                        second: "h:mm a",
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: "rgba(200, 200, 200, 0.3)",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#343a40",
                    font: {
                        size: 14,
                    },
                },
            },
        },
    },
});


// Função para remover dados antigos do gráfico (manter no máximo 10 pontos)
function removeOldData(chart) {
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
    }
}

client.publish("ESP_COMMAND", "GETGRAPHINFO");
client.on("message", Handler);