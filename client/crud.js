export async function buildApp(appName, appDescription) {
    const response = await fetch(`/build/${appName}/${appDescription}`);
    return await response.json();
}

