# AI Study Buddy

An intelligent web application designed to help students learn faster and more efficiently. This tool uses the power of generative AI to summarize text, create practice quizzes, generate flashcards, and analyze text from a live camera feed.

![AI Study Buddy Screenshot](./aistudybuddy-screenshot.jpg)

## Features

* **AI Summarizer:** Paste any block of text to get a concise, bulleted summary of the key points.
* **Quiz Generator:** Automatically create multiple-choice practice quizzes from any study material.
* **Flashcard Creator:** Instantly generate terms and definitions from your notes to help with active recall.
* **Direct Q&A:** Get answers to specific multiple-choice questions.
* **Live Camera Scanner (OCR):** Use your device's camera to scan text from physical books or notes and have the AI analyze it in real-time.
* **Save Notes:** Persistently save important results to your browser's local storage for future reference.
* **Modern & Responsive UI:** A clean, intuitive, and visually appealing interface that works on all devices.

## Tech Stack

This is a pure client-side application built with modern web technologies. No backend is required.

* **HTML5:** For the core structure of the application.
* **CSS3 & Tailwind CSS:** For styling, responsiveness, and the modern "glassmorphism" design.
* **Vanilla JavaScript (ES6+):** For all application logic, event handling, and DOM manipulation.
* **Google Gemini API:** The generative AI model that powers the summarization, Q&A, and content generation features.
* **Tesseract.js:** An open-source Optical Character Recognition (OCR) library that recognizes text from the camera feed directly in the browser.
* **Browser `localStorage`:** To enable the "Save Notes" feature without needing a database.

## Getting Started

To run this project on your own machine, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine using Git:

```
git clone [https://github.com/harshtiwarig/AIStudyBuddy.git](https://github.com/harshtiwarig/AIStudyBuddy.git)
```

Then, navigate into the project directory:

```
cd AIStudyBuddy
```

### 2. Get a Google AI API Key

This project requires a Google AI API key to function.

* Visit [**Google AI Studio**](https://aistudio.google.com/app/apikey) to create a free API key.

### 3. Add Your API Key

* Open the `app.js` file in your code editor.
* Find the following line (around line 17):
    ```
    const apiKey = ""; //your API KEY
    ```
* Enter **your own API key** inside the quotes.

### 4. Run with a Live Server

Because this application makes API calls from the browser, you need to run it from a local web server to avoid security (CORS) errors.

* If you are using **Visual Studio Code**, install the [**Live Server**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
* Right-click the `index.html` file and select **"Open with Live Server"**.

The application should now be running in your browser!

## Contact

Harsh Tiwari

* **GitHub:** [harshtiwarig](https://github.com/harshtiwarig)
* **LinkedIn:** [https://www.linkedin.com/in/harshtiwarig](https://www.linkedin.com/in/harshtiwarig)
* **Email:** harshtiwari62032@gmail.com
