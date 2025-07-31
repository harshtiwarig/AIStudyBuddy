const courseText = document.getElementById('courseText');
const summarizeBtn = document.getElementById('summarizeBtn');
const quizBtn = document.getElementById('quizBtn');
const answerBtn = document.getElementById('answerBtn');
const flashcardBtn = document.getElementById('flashcardBtn');
const resetBtn = document.getElementById('resetBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const outputContent = document.getElementById('outputContent');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const cameraBtn = document.getElementById('cameraBtn');
const captureBtn = document.getElementById('captureBtn');
const videoFeed = document.getElementById('videoFeed');
const cameraModal = document.getElementById('cameraModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const notesList = document.getElementById('notesList');

const apiKey = ""; //Your API KEY
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

let currentOutputForSaving = "";
let cameraStream = null;

function disableAllButtons() {
    summarizeBtn.disabled = true;
    quizBtn.disabled = true;
    answerBtn.disabled = true;
    flashcardBtn.disabled = true;
    resetBtn.disabled = true;
    saveNoteBtn.disabled = true;
    cameraBtn.disabled = true;
    captureBtn.disabled = true;
}

function enableAllButtons() {
    summarizeBtn.disabled = false;
    quizBtn.disabled = false;
    answerBtn.disabled = false;
    flashcardBtn.disabled = false;
    resetBtn.disabled = false;
    saveNoteBtn.disabled = !currentOutputForSaving;
    cameraBtn.disabled = false;
    captureBtn.disabled = !!cameraStream;
}

async function getAiResponse(prompt) {
    loaderText.textContent = 'Thinking...';
    loader.style.display = 'flex';
    outputContent.innerHTML = '';
    currentOutputForSaving = "";
    disableAllButtons();

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const result = await response.json();
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            currentOutputForSaving = responseText;
            // Remove asterisks for bolding/italics, then replace newlines with <br>
            return responseText.replace(/\*/g, '').replace(/\n/g, '<br>');
        } else {
            return "Sorry, I couldn't generate a response.";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `<strong>An error occurred.</strong><br>Please check the console for details.`;
    } finally {
        loader.style.display = 'none';
        loaderText.textContent = '';
        enableAllButtons();
    }
}

function showSavedNotes() {
    const notes = JSON.parse(localStorage.getItem('studyNotes')) || [];
    notesList.innerHTML = '';
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="text-gray-500">Your saved notes will appear here.</p>';
        return;
    }
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'noteCard';
        noteElement.innerHTML = `
            <p>${note.content.replace(/\*/g, '').replace(/\n/g, '<br>')}</p>
            <div class="text-right mt-2">
                <button data-index="${index}" class="deleteNoteBtn text-red-500 hover:text-red-700 text-sm">Delete</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    cameraModal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    showSavedNotes();

    summarizeBtn.addEventListener('click', async () => {
        const text = courseText.value.trim();
        if (!text) return;
        const prompt = `Act as a study assistant. Read the following text and provide a concise summary of the key points in a bulleted list. Text: "${text}"`;
        const summary = await getAiResponse(prompt);
        outputContent.innerHTML = `<h3>Key Points Summary:</h3>${summary}`;
    });

    quizBtn.addEventListener('click', async () => {
        const text = courseText.value.trim();
        if (!text) return;
        const prompt = `Act as a study assistant. Based on the following text, generate a short multiple-choice practice quiz (3-5 questions). Provide answers separately at the end. Text: "${text}"`;
        const quiz = await getAiResponse(prompt);
        outputContent.innerHTML = `<h3>Practice Quiz:</h3>${quiz}`;
    });

    answerBtn.addEventListener('click', async () => {
        const text = courseText.value.trim();
        if (!text) return;
        const prompt = `Analyze the following multiple-choice question. Respond with ONLY the letter and/or text of the correct option. Do not add explanations. Question: "${text}"`;
        const answer = await getAiResponse(prompt);
        outputContent.innerHTML = `<h3>Suggested Answer:</h3><p class="text-lg font-semibold">${answer}</p>`;
    });

    flashcardBtn.addEventListener('click', async () => {
        const text = courseText.value.trim();
        if (!text) return;
        const prompt = `Based on the following text, generate a set of 3-5 flashcards. For each flashcard, provide a 'Term:' on one line and a 'Definition:' on the next. Separate each flashcard with '---'. Text: "${text}"`;
        const flashcards = await getAiResponse(prompt);
        outputContent.innerHTML = `<h3>Flashcards:</h3>${flashcards}`;
    });

    resetBtn.addEventListener('click', () => {
        courseText.value = '';
        outputContent.innerHTML = '';
        currentOutputForSaving = "";
        saveNoteBtn.disabled = true;
        stopCamera();
    });

    saveNoteBtn.addEventListener('click', () => {
        if (!currentOutputForSaving) return;
        const notes = JSON.parse(localStorage.getItem('studyNotes')) || [];
        notes.push({ content: currentOutputForSaving, date: new Date().toISOString() });
        localStorage.setItem('studyNotes', JSON.stringify(notes));
        showSavedNotes();
    });

    notesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteNoteBtn')) {
            const indexToDelete = event.target.dataset.index;
            let notes = JSON.parse(localStorage.getItem('studyNotes')) || [];
            notes.splice(indexToDelete, 1);
            localStorage.setItem('studyNotes', JSON.stringify(notes));
            showSavedNotes();
        }
    });

    cameraBtn.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                videoFeed.srcObject = cameraStream;
                cameraModal.classList.remove('hidden');
                captureBtn.disabled = false;
            } catch (error) {
                console.error("Error accessing camera:", error);
                alert("Could not access camera. Please check permissions in your browser settings.");
            }
        }
    });

    closeModalBtn.addEventListener('click', stopCamera);

    captureBtn.addEventListener('click', async () => {
        if (!cameraStream) return;
        stopCamera(); 
        loaderText.textContent = 'Reading text from camera...';
        loader.style.display = 'flex';
        outputContent.innerHTML = '';
        disableAllButtons();

        const canvas = document.createElement('canvas');
        canvas.width = videoFeed.videoWidth;
        canvas.height = videoFeed.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
        
        try {
            const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                       loaderText.textContent = `Recognizing... (${Math.round(m.progress * 100)}%)`;
                    }
                }
            });
            
            if (text && text.trim()) {
                courseText.value = text;
                const prompt = `Analyze the following text from an image. If it's a question, answer it. If it's content, summarize it. Text: "${text}"`;
                const answer = await getAiResponse(prompt);
                outputContent.innerHTML = `<h3>Analysis Result:</h3><p class="text-lg font-semibold">${answer}</p>`;
            } else {
                outputContent.innerHTML = '<p class="text-orange-500">Couldn\'t find any text. Try getting a clearer picture.</p>';
                enableAllButtons();
                loader.style.display = 'none';
                loaderText.textContent = '';
            }
        } catch (error) {
             console.error("OCR Error:", error);
             outputContent.innerHTML = '<strong>Oops, something went wrong with text recognition.</strong>';
             enableAllButtons();
             loader.style.display = 'none';
             loaderText.textContent = '';
        }
    });
});
