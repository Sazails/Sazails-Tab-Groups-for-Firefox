// Define the groups and their corresponding colors and subscribed tab (tabId and tabName) arrays
const groups = [
    { name: "Group 1", color: "DodgerBlue", tabs: [] },
    { name: "Group 2", color: "MediumTurquoise", tabs: [] },
    { name: "Group 3", color: "DarkCyan", tabs: [] },
];

function getTabGroups() {
    return groups;
}

function getTabGroupNames() {
    return groups.map((group) => group.name);
}

function getTabNamesFromGroup(groupName) {
    const group = groups.find((g) => g.name === groupName);
    if (group) {
        return group.tabs.map((tab) => tab.tabName);
    }
    return [];
}

// Function to add a tab to a group
function addToGroup(groupId, tabId, tabName) {
        const group = groups.find((g) => g.name === `Group ${groupId}`);
        if (group) {
                group.tabs.push({ tabID: tabId, tabName: tabName }); // Add tabId and tabName to the tabs array of the group
                console.log(`Tab ${tabId} added to Group ${groupId}`);
        }
}

// Function to remove a tab from a group
function removeFromGroup(groupId, tabId) {
    const group = groups.find((g) => g.name === `Group ${groupId}`);
    if (group) {
        const index = group.tabs.findIndex((tab) => tab.tabID === tabId);
        if (index !== -1) {
            group.tabs.splice(index, 1); // Remove the tab object from the tabs array of the group
            console.log(`Tab ${tabId} removed from Group ${groupId}`);
        }
    }
}

// Create context menu items for each group
groups.forEach((group, index) => {
    browser.contextMenus.create({
    id: `group-${index + 1}`,
    title: group.name,
    contexts: ["tab"],
    onclick: (info, tab) => {
        const group = groups.find((g) => g.name === `Group ${index + 1}`);
        if (group && group.tabs.some((t) => t.tabID === tab.id)) { 
            removeFromGroup(index + 1, tab.id);
        } else {
            addToGroup(index + 1, tab.id, tab.title);
        }
    },
    });
});

// Listen for messages from other scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);
    if (request.action === "getTabGroups") {
        const tabGroups = getTabGroups();
        sendResponse(tabGroups);
    } else if (request.action === "getTabGroupNames") {
        const tabGroupNames = getTabGroupNames();
        sendResponse(tabGroupNames);
    } else if (request.action === "getTabNamesFromGroup") {
        const tabNames = getTabNamesFromGroup(request.groupName);
        sendResponse(tabNames);
    } else {
        console.warn("Unknown action:", request.action);
        sendResponse(null);
    }
});
