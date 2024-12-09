document.getElementById('submit').addEventListener('click', () => {
    const commandInput = document.getElementById('command');
    const command = commandInput.value;

    if (!command.trim()) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "Please enter a command.";
        document.getElementById('story').appendChild(errorMessage);
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 1000);
        return;
    }

    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = `${command}`;
    document.getElementById('story').appendChild(userMessage);

    commandInput.value = '';

    fetch('http://localhost:5000/api/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
    })
        .then(response => response.json())
        .then(data => {
            const story = document.getElementById('story');
            const aiMessage = document.createElement('div');
            aiMessage.classList.add('ai-message');
            aiMessage.textContent = `${data.response}`;
            story.appendChild(aiMessage);
            story.scrollTop = story.scrollHeight;
        })
        .catch(() => {
            const story = document.getElementById('story');
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('ai-message');
            errorMessage.textContent = "Error communicating with the game master.";
            story.appendChild(errorMessage);
            story.scrollTop = story.scrollHeight;
        });
});
