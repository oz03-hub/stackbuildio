import * as crud from './crud.js';

const appNameField = document.getElementById("appName");
const appDescField = document.getElementById("appDescription");

const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");

const toolsContainer = document.getElementById("toolsContainer");
const loadField = document.getElementById("loader");

resetButton.addEventListener('click', (e) => {
    appNameField.value = '';
    appDescField.value = '';
    toolsContainer.innerHTML = '';
    loadField.textContent = 'Your suggestions will show up here...';
});

submitButton.addEventListener('click', async (e) => {
    toolsContainer.innerHTML = '';
    const name = appNameField.value.trim();
    const desc = appDescField.value.trim();
    if (name === "") {
        alert("Please specify an Application name.");
        return;
    }

    if (desc === "") {
        alert("Please specify an Application description.");
        return;
    }

    loadField.textContent = "Loading...";
    const data = await crud.buildApp(name, desc);
    if (!data["error"]) {
        const toolsList = document.createElement('ul');
        const tools = data["tools"];
        for (const tool of tools) {
            const listItem = document.createElement('li');
            const header = document.createElement('h2');
            const subParagraph = document.createElement('p');

            header.textContent = tool["toolName"];
            subParagraph.textContent = tool["toolDescription"];
            listItem.appendChild(header);
            listItem.appendChild(subParagraph);

            toolsList.appendChild(listItem);
        }

        toolsContainer.appendChild(toolsList);

        const fitText = document.createElement('h3');
        fitText.textContent = "How to it fits together 🤔";
        const p = document.createElement('p');
        p.textContent = data["fit"];
        toolsContainer.appendChild(fitText);
        toolsContainer.appendChild(p);

        const addButton = document.createElement('button');
        addButton.textContent = "Share your project!";
    } else {
        loadField.textContent = "An error occurred :(";
        alert("Please make sure you are using this web app correctly...");
        return;
    }

    loadField.textContent = `${name} Complete!`;
});