import * as crud from './crud.js';

const appNameField = document.getElementById("appName");
const appDescField = document.getElementById("appDescription");

const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");

const toolsContainer = document.getElementById("toolsContainer");
const loadField = document.getElementById("loader");

let userTools = null;

function render() {
    appNameField.value = localStorage.getItem('appNameField') || '';
    appDescField.value = localStorage.getItem('appDescField') || '';
    userTools = JSON.parse(localStorage.getItem('userTools')) || null;

    if (userTools !== null) {
        renderToolContainer(userTools, toolsContainer);
    }
}

resetButton.addEventListener('click', async (e) => {
    toolsContainer.innerHTML = '';
    loadField.textContent = 'Your suggestions will show up here...';
    localStorage.clear();
    render();
});

function renderToolContainer(data, parentElement) {
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

    loadField.textContent = `${data["app"]} Complete!`;

    parentElement.appendChild(toolsList);
    const fitText = document.createElement('h2');
    fitText.textContent = "How to it fits together 🤔";
    const p = document.createElement('p');
    p.textContent = data["fit"];
    parentElement.appendChild(fitText);
    parentElement.appendChild(p);

    const h3 = document.createElement('h3');
    h3.textContent = "Would you like to share this idea with others?";

    const nameLabel = document.createElement('label');
    nameLabel.textContent = "Developer name: ";
    nameLabel.setAttribute('for', 'nameInput');

    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'nameInput');
    nameInput.setAttribute('placeholder', 'Enter your name');

    parentElement.appendChild(h3);
    parentElement.appendChild(nameLabel);
    parentElement.appendChild(nameInput);

    const addButton = document.createElement('button');
    addButton.textContent = "Share your project!";
    parentElement.appendChild(addButton);

    const disclaimer = document.createElement('p');
    disclaimer.style.fontSize = '12px';
    disclaimer.style.color = 'red';
    disclaimer.textContent = "By sharing your project, you agree to relinquish copyright claims on your application. Ozel Yilmazel holds no legal responsibility for the security of your application.";
    parentElement.appendChild(disclaimer);
}

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

    localStorage.setItem('appNameField', name);
    localStorage.setItem('appDescField', desc);

    loadField.textContent = "Loading...";
    const data = await crud.buildApp(name, desc);
    if (!data["error"]) {
        localStorage.setItem('userTools', JSON.stringify(data));
        renderToolContainer(data, toolsContainer);
    } else {
        loadField.textContent = "Your suggestions will show up here...";
        alert("AI module rejected your request. This can happen because you have not described your application well enough or you are asking for a different task that is not supported by the AI module.");
        return;
    }
});

render();