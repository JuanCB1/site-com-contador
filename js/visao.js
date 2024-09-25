const videoElement = document.getElementById('videoElement');
const peopleCountElement = document.getElementById('peopleCount');
const savedPeopleCountElement = document.getElementById('savedPeopleCount');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let savedCount = 0;
let peopleCrossed = 0;

// Carregar o número de pessoas salvas no Local Storage ao carregar a página
const savedCountLocalStorage = localStorage.getItem('people_crossed_count') || 0;
savedPeopleCountElement.innerText = savedCountLocalStorage;

// Função para iniciar a captura de vídeo
function startVideoStream() {
    navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then(stream => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
        };
    })
    .catch(err => {
        console.error("Erro ao acessar a câmera: " + err);
    });
}

// Função para verificar se a pessoa cruzou a linha
function hasCrossedLine(x, previousX, lineX) {
    return previousX < lineX && x >= lineX;  // Verifica cruzamento da esquerda para a direita
}

// Carregar o modelo COCO-SSD e iniciar a detecção
async function detectPeople() {
    const model = await cocoSsd.load();
    console.log("Modelo COCO-SSD carregado");

    let previousPositions = [];

    setInterval(async () => {
        const predictions = await model.detect(videoElement);
        let peopleCount = 0;

        // Limpar o canvas para redesenhar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar a linha vertical no canvas
        const lineX = canvas.width / 2;  // Linha no meio vertical
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Processar as detecções
        predictions.forEach((prediction, index) => {
            if (prediction.class === 'person') {
                peopleCount++;

                // Desenhar o bounding box da pessoa detectada
                const [x, y, width, height] = prediction.bbox;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);

                // Calcular a posição do centro da pessoa no eixo X
                const centerX = x + width / 2;

                // Verificar se a pessoa cruzou a linha vertical
                const previousX = previousPositions[index] || 0;
                if (hasCrossedLine(centerX, previousX, lineX)) {
                    // Incrementar o contador de pessoas que cruzaram a linha
                    peopleCrossed++;
                    localStorage.setItem('people_crossed_count', peopleCrossed);
                    savedPeopleCountElement.innerText = peopleCrossed;
                }

                // Atualizar a posição anterior da pessoa
                previousPositions[index] = centerX;
            }
        });

        // Atualizar a contagem de pessoas detectadas
        peopleCountElement.innerText = peopleCount;

    }, 200);  // Faz a detecção a cada 1 segundo
}

// Iniciar a captura de vídeo e a detecção de pessoas
startVideoStream();
detectPeople();