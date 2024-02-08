document.addEventListener("DOMContentLoaded", function() {
    const groupList = document.getElementById("group-list");

    console.log("Generating tab group view");
    // Your code here

    browser.runtime
        .sendMessage({ action: "getTabGroups" })
        .then(function (response) {
            var tabGroups = response;
            console.log("Received tab groups:", tabGroups);
            var newGroupList = document.createElement("ul"); 
            tabGroups.forEach(function (group) {
                var listItem = document.createElement("li");
                listItem.textContent = group.name;
                listItem.style.color = group.color;
                newGroupList.appendChild(listItem);

                var tabList = document.createElement("ul");
                listItem.appendChild(tabList);

                group.tabs.forEach(function (tab) {
                    var tabItem = document.createElement("li");
                    tabItem.textContent = tab.tabName;
                    tabList.appendChild(tabItem);
                });

                listItem.addEventListener("click", function() {
                    tabList.style.display = tabList.style.display === "none" ? "block" : "none";
                });
            });

            groupList.appendChild(newGroupList); // Append the newGroupList to groupList
        })
        .catch(function (error) {
            console.error("Error retrieving tab groups:", error);
        });
});

