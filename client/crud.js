export async function buildApp(appName, appDescription) {
    const response = await fetch(`/build/${appName}/${appDescription}`);
    return await response.json();
}

export async function shareApp(body) {
    const response = await fetch("/create", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function getAppById(id) {
    const response = await fetch(`/read/${id}`, {
        method: 'GET',
    });
    return await response.json();
}

export async function updateApp(body) {
    const response = await fetch("/update", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function deleteAppById(id) {
    const response = await fetch(`/delete/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
}

export async function readAllApps() {
    const response = await fetch("/read/all", {
        method: 'GET',
    });
    return response.json();
}
