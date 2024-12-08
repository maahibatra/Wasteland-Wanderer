const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct';

const getAIResponse = async (inputText) => {
    const prompt = `You are the game master of a text-based role-playing game. Interpret the player's input and continue the story in a dynamic and engaging way.`;

    try {
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            { inputs: `${prompt}\n\nPlayer: ${inputText}` },
            { headers: { Authorization: `Bearer ${process.env.hfKey}` } }
        );
        return response.data[0]?.generated_text || "I couldn't understand that.";
    } catch (error) {
        console.error('Error communicating with Hugging Face API:', error);
        return "Sorry, there was an error processing your request.";
    }
};

app.post('/api/command', async (req, res) => {
    const userCommand = req.body.command;
    const aiResponse = await getAIResponse(userCommand);
    res.json({ response: aiResponse });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
