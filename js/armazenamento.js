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
Chart.defaults.font.family = "'Roboto', sans-serif";
Chart.defaults.color = '#343a40';
Chart.defaults.font.size = 14;

// Função para adicionar dados ao gráfico
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// Função para atualizar as informações dos sensores
function updateSensorInfo() {
    // Valores fictícios para teste
    const levelSensorValue = Math.floor(Math.random() * 100);
    const humiditySensorValue = Math.floor(Math.random() * 100);

    document.getElementById('sensor-nível').innerText = levelSensorValue + '%';
    document.getElementById('sensor-umidade').innerText = humiditySensorValue + '%';

    // Adicionar dados ao gráfico
    addData(Gráficonível, new Date(), levelSensorValue);
    addData(Gráficoumidade, new Date(), humiditySensorValue);
}

// Configuração do gráfico de Nível de Alimento
const ctxLevel = document.getElementById('Gráficonível').getContext('2d');
const Gráficonível = new Chart(ctxLevel, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Nível de Alimento (%)',
            data: [],
            borderColor: pretoazulado,
            backgroundColor: pretoazulado + 33,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: pretoazulado,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: pretoazulado
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'h:mm a'
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#343a40',
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});

// Configuração do gráfico de Umidade
const ctxHumidity = document.getElementById('Gráficoumidade').getContext('2d');
const Gráficoumidade = new Chart(ctxHumidity, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Umidade (%)',
            data: [],
            borderColor: pretoazulado,
            backgroundColor: pretoazulado + 33,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: pretoazulado,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: pretoazulado
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'h:mm a'
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#343a40',
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});

// Atualiza as informações dos sensores e remove dados antigos a cada 5 segundos
setInterval(function () {
    updateSensorInfo();
    removeOldData(Gráficonível);
    removeOldData(Gráficoumidade);
}, 5000);

// Função para remover dados antigos do gráfico (manter no máximo 10 pontos)
function removeOldData(chart) {
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
    }
}

// Chamada inicial para atualizar os gráficos
updateSensorInfo();
