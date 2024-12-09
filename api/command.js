const axios = require('axios');

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct';

const getAIResponse = async (inputText) => {
    const prompt = `
    You are the game master of a text-based role-playing game in a post-apocalyptic world.
    The player starts the game by waking up at a broken radio tower. 
    You must strictly follow these instructions:

    The player's command: "${inputText}"

    Describe the player's action and what happens due to those actions in one sentence (maximum 35 words).
    Provide three possible actions for the player to take next, in the format [action 1, action 2, action 3].
    Do not proceed with the story too fast, give tiny actions and tasks to the player.
    Do not repeat the player's command.
    Do not include additional context, descriptions, or introductions.
    Only respond with the action and possible actions. Do not add any extra information.
   `;

    try {
        console.log("Sending prompt to Hugging Face API:", prompt);

        const response = await axios.post(
            HUGGING_FACE_API_URL,
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${process.env.hfKey}` } }
        );

        console.log("Raw AI output:", response.data);

        let aiOutput = response.data[0]?.generated_text || "I couldn't understand that.";

        let cleanedOutput = aiOutput.replace(/You are the game master[^]*?extra information./g, '').trim();
        cleanedOutput = cleanedOutput.replace(/](.*)$/s, ']').trim();

        console.log("Cleaned AI output:", cleanedOutput);

        return cleanedOutput || "Sorry, there was an error processing your request.";
    } catch (error) {
        console.error('Error communicating with Hugging Face API:', error);
        return "Sorry, there was an error processing your request.";
    }
};

module.exports = { getAIResponse };
