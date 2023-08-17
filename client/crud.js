export async function buildApp(appName, appDescription) {
    try {
        const response = await fetch(`/build/${appName}/${appDescription}`);
        if (!response.ok) {
            throw new Error('Failed to build the app.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in buildApp:', error);
        throw error;
    }
}

export async function shareApp(body) {
    try {
        const response = await fetch("/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Failed to share the app.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in shareApp:', error);
        throw error;
    }
}

export async function getAppById(id) {
    try {
        const response = await fetch(`/read/${id}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Failed to get the app by ID.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in getAppById:', error);
        throw error;
    }
}

export async function updateApp(body) {
    try {
        const response = await fetch("/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Failed to update the app.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in updateApp:', error);
        throw error;
    }
}

export async function deleteAppById(id) {
    try {
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete the app.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in deleteAppById:', error);
        throw error;
    }
}

export async function readAllApps() {
    try {
        const response = await fetch("/read/all", {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Failed to read all apps.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in readAllApps:', error);
        throw error;
    }
}
