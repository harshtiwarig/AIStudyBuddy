// This is a Node.js function that will run on Netlify's servers
exports.handler = async function (event) {
    // Get the secret API key from an environment variable on Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Get the prompt that the user sent from the frontend
    const { prompt } = JSON.parse(event.body);

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    try {
        // Make the call to the Google AI API from the server
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        // Send the result back to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An internal error occurred." })
        };
    }
};
