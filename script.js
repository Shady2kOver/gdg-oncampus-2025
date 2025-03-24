let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
    console.log("Choose File button clicked");
});



document.getElementById('fileInput').addEventListener('change', uploadDocument);
document.getElementById('boldFirstLetter').addEventListener('change', toggleBoldFirstLetter);

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                alert("Time's up!");
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function uploadDocument() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        if (file.type === "application/pdf") {
            reader.onload = function(e) {
                const pdfData = new Uint8Array(e.target.result);
                pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        page.getTextContent().then(textContent => {
                            const textItems = textContent.items.map(item => item.str);
                            const text = textItems.join(' ');
                            document.getElementById('documentContent').innerHTML = formatText(text);
                            document.getElementById('documentDisplay').style.display = 'block';
                        });
                    });
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = function(e) {
                document.getElementById('documentContent').innerHTML = formatText(e.target.result);
                document.getElementById('documentDisplay').style.display = 'block';
            };
            reader.readAsText(file);
        }
    }
}



function formatText(text) {
    return text.split(' ').map(word => `<strong>${word.charAt(0)}</strong>${word.slice(1)}`).join(' ');
}

function toggleBoldFirstLetter() {
    const contentDiv = document.getElementById('documentContent');
    const words = contentDiv.innerHTML.split(' ');
    if (this.checked) {
        for (let i = 0; i < words.length; i++) {
            words[i] = `<strong>${words[i][0]}</strong>${words[i].slice(1)}`;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].replace(/<strong>(.*?)<\/strong>/, '$1');
        }
    }
    contentDiv.innerHTML = words.join(' ');
}
