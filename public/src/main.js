let gameState = {
    location: "radio_tower",
    inventory: [],
};

document.getElementById('submit').addEventListener('click', () => {
    const command = document.getElementById('command').value;

    fetch('http://localhost:5000/api/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, gameState }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('story').textContent = data.response;
            gameState = data.updatedGameState || gameState;
        })
        .catch(() => {
            document.getElementById('story').textContent = "Error communicating with the game master.";
        });

    document.getElementById('command').value = '';
});
