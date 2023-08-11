import * as crud from './crud.js';

const appNameField = document.getElementById("appName");
const appDescField = document.getElementById("appDescription");

const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");

const toolsContainer = document.getElementById("toolsContainer");
const loadField = document.getElementById("loader");

const appsContainer = document.getElementById("appsContainer");

let userTools = null;
let allApps = null;

document.getElementById("readButton").addEventListener('click', async (e) => {
    const p = document.getElementById("testPar");
    const d = await crud.readAllApps();
    p.textContent = JSON.stringify(d);
});

async function render() {
    appNameField.value = localStorage.getItem('appNameField') || '';
    appDescField.value = localStorage.getItem('appDescField') || '';
    userTools = JSON.parse(localStorage.getItem('userTools')) || null;

    if (userTools !== null) {
        renderToolContainer(userTools, toolsContainer);
    }

    allApps = await crud.readAllApps();
    renderAppsListing(allApps);
}

function renderAppsListing(apps) {
    appsContainer.innerHTML = '';
    const appListing = document.createElement('ul');
    for (const app of apps) {
        const appItem = document.createElement("li");
        const h2 = document.createElement("h2");
        h2.textContent = app["appName"];
        const summary = document.createElement("p");
        summary.textContent = app["appSummary"];
        const author = document.createElement("p");
        author.textContent = ` - ${app["appAuthor"]}`;
        author.style.fontSize = '12px';
        appItem.appendChild(h2);
        appItem.appendChild(summary);
        appItem.appendChild(author);
        appListing.appendChild(appItem);
    }
    appsContainer.appendChild(appListing);
}

resetButton.addEventListener('click', async (e) => {
    toolsContainer.innerHTML = '';
    loadField.textContent = 'Your suggestions will show up here...';
    localStorage.clear();
    await render();
});

function renderToolContainer(data, parentElement) {
    toolsContainer.innerHTML = '';
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

    addButton.addEventListener('click', async (e) => {
        if (nameInput.value.trim() === '') {
            alert('Please input your name for our records');
            return;
        }

        const author = nameInput.value;
        const body = {
            appName: appNameField.value,
            appDesc: appDescField.value,
            appSummary: data["summary"],
            appAuthor: author
        };
        await crud.shareApp(body);
        await render();
    });

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

await render();