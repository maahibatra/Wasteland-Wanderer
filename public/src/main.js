let gameState = {
    location: "radio_tower",
    inventory: [],
};

const locations = {
    radio_tower: {
        description: "You stand in front of an old, crumbling radio tower.",
        actions: ["look", "search", "move"],
    },
    bunker: {
        description: "A heavily guarded bunker lies before you.",
        actions: ["look", "enter", "search"],
    },
};

function handleCommand(command) {
    const storyElement = document.getElementById("story");
    switch (command) {
        case "look":
            storyElement.textContent = locations[gameState.location].description;
            break;
        case "search":
            storyElement.textContent = "You search the area for useful items.";
            gameState.inventory.push("scrap metal");
            break;
        case "move":
            gameState.location = "bunker";
            storyElement.textContent = "You move towards the bunker.";
            break;
        default:
            storyElement.textContent = "I don't understand that command.";
    }
}

document.getElementById("submit").addEventListener("click", () => {
    const command = document.getElementById("command").value;
    handleCommand(command);
    document.getElementById("command").value = "";
});
