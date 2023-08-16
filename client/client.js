import * as crud from './crud.js';

const appNameField = document.getElementById("appName");
const appDescField = document.getElementById("appDescription");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
const toolsContainer = document.getElementById("toolsContainer");
const loadField = document.getElementById("loader");
const appsContainer = document.getElementById("appsContainer");

// Data
let userTools = null;
let allApps = null;
let myApp = {
    appName: "",
    appDesc: "",
    isMyApp: true,
};

// Event Listeners
resetButton.addEventListener('click', handleResetButtonClick);
submitButton.addEventListener('click', handleSubmitButtonClick);

// Functions
async function render() {
    loadLocalStorageData();
    renderUserTools();
    await renderAllApps();
}

function loadLocalStorageData() {
    appNameField.value = localStorage.getItem('appNameField') || '';
    appDescField.value = localStorage.getItem('appDescField') || '';
    userTools = JSON.parse(localStorage.getItem('userTools')) || null;
}

function renderUserTools() {
    if (userTools !== null) {
        renderToolContainer(userTools, toolsContainer);
    }
}

async function renderAllApps() {
    allApps = await crud.readAllApps();
    renderAppsListing(allApps);
}

function renderAppsListing(apps) {
    appsContainer.innerHTML = '';
    const appListing = document.createElement('ul');
    for (const app of apps) {
        const appItem = createAppListItem(app);
        appListing.appendChild(appItem);
    }
    appsContainer.appendChild(appListing);
}

function createAppListItem(app) {
    const appItem = document.createElement("li");
    appItem.setAttribute('class', 'appItem');
    
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

    appItem.addEventListener('click', () => {
        handleAppItemClick(app);
    });

    if (app["owner"]) {
        const deleteButton = createDeleteButton(app["_id"]);
        appItem.appendChild(deleteButton);
    }

    return appItem;
}

function createDeleteButton(appId) {
    const deleteButton = document.createElement('button');
    deleteButton.style.background = 'darkred';
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', async () => {
        await handleDeleteButtonClick(appId);
    });

    return deleteButton;
}

async function handleAppItemClick(app) {
    await handleResetButtonClick();

    appNameField.value = app["appName"];
    appDescField.value = app["appDesc"];
    myApp = {
        appName: appNameField.value,
        appDesc: appDescField.value,
        isMyApp: app["owner"],
        _id: app["_id"]
    };
}

async function handleDeleteButtonClick(appId) {
    await crud.deleteAppById(appId);
    await render();
}

async function handleResetButtonClick() {
    toolsContainer.innerHTML = '';
    loadField.textContent = 'Your suggestions will show up here...';
    localStorage.clear();
    myApp = {
        appName: "",
        appDesc: "",
        isMyApp: true,
    };
    await render();
}

async function handleSubmitButtonClick() {
    toolsContainer.innerHTML = '';
    const name = appNameField.value.trim();
    const desc = appDescField.value.trim();
    myApp["appName"] = name;
    myApp["appDesc"] = desc;

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
}

function createToolListItem(tool) {
    const listItem = document.createElement('li');
    const header = document.createElement('h2');
    const subParagraph = document.createElement('p');

    header.textContent = tool["toolName"];
    subParagraph.textContent = tool["toolDescription"];
    
    listItem.appendChild(header);
    listItem.appendChild(subParagraph);

    return listItem;
}

function createShareStaging(data, parentElement) {
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

function createUpdateStaging(data, parentElement) {
    const h3 = document.createElement('h3');
    h3.textContent = 'Got any updates? Push your updates to our server!';
    const updateButton = document.createElement('button');
    updateButton.textContent = "Update!";
    updateButton.style.backgroundColor = "cornflowerblue";
    updateButton.addEventListener('click', async (e) => {
        const res = await crud.updateApp(data);
        await render();
    });
    const disclaimer = document.createElement('p');
    disclaimer.style.fontSize = '12px';
    disclaimer.style.color = 'red';
    disclaimer.textContent = "By sharing your project, you agree to relinquish copyright claims on your application. Ozel Yilmazel holds no legal responsibility for the security of your application.";
    parentElement.appendChild(h3);
    parentElement.appendChild(updateButton);
    parentElement.appendChild(disclaimer);
}

function renderToolContainer(data, parentElement) {
    toolsContainer.innerHTML = '';
    const toolsList = document.createElement('ul');
    const tools = data["tools"];
    for (const tool of tools) {
        toolsList.appendChild(createToolListItem(tool));
    }

    loadField.textContent = `${data["app"]} Complete!`;

    parentElement.appendChild(toolsList);
    const fitText = document.createElement('h2');
    fitText.textContent = "How to it fits together 🤔";
    const p = document.createElement('p');
    p.textContent = data["fit"];
    parentElement.appendChild(fitText);
    parentElement.appendChild(p);

    if (myApp["_id"] === undefined) {
        createShareStaging(data, parentElement);
    } else if (myApp["isMyApp"]) {
        const myObj = {
            _id: myApp["_id"],
            appName: myApp["appName"],
            appDesc: myApp["appDesc"],
            appSummary: data["summary"],
        };

        createUpdateStaging(myObj, parentElement);
    }
}

// Initial rendering
await render();
