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

const getAIResponse = async (inputText, gameState) => {
    const prompt = `
    You are the game master of a text-based role-playing game in a post-apocalyptic world.
    Make sure the storyline continues according to what peviously happened.
    Do not make anything up or add to the story on your own.
    
    The player commands: "${inputText}"

    Based on this, give only:
    An action (max 35 words) describing what happens after the player's action.
    Possible actions for the player to take next, enclosed in brackets, like: [action 1, action 2].

    Do not include unnecessary introductory phrases.
    Do not repeat the player's command or provide any additional context or phrases like "brief action:", "possible actions:", “certainly!”, etc.
   `;

    try {
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${process.env.hfKey}` } }
        );

        let aiOutput = response.data[0]?.generated_text || "I couldn't understand that.";
        
        console.log("Raw AI output:", aiOutput);

        let cleanedOutput = aiOutput.replace(/You are the game master[^]*?“certainly!”, etc./g, '').trim();
        cleanedOutput = cleanedOutput.replace(/](.*)$/s, ']').trim();

        console.log("Cleaned AI output:", cleanedOutput);

        return cleanedOutput || "Sorry, there was an error processing your request.";
    } catch (error) {
        console.error('Error communicating with Hugging Face API:', error);
        return "Sorry, there was an error processing your request.";
    }
};

app.post('/api/command', async (req, res) => {
    const { command } = req.body;

    const aiResponse = await getAIResponse(command);

    res.json({ 
        response: aiResponse
    });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
