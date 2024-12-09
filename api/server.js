const express = require('express');
const path = require('path');
const cors = require('cors');
const { getAIResponse } = require('./command');
const app = express();
const port = 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/command', async (req, res) => {
    const { command } = req.body;

    console.log("Received command:", command);

    const aiResponse = await getAIResponse(command);

    console.log("AI response:", aiResponse);

    res.json({ 
        response: aiResponse
    });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
