function loadDailyStats() {

    chrome.storage.local.get(null, data => {

        document.getElementById("dailyReels").innerText =
            data.dailyReels || 0;

        document.getElementById("dailyShorts").innerText =
            data.dailyShorts || 0;

        document.getElementById("dailyTime").innerText =
            data.dailyTime || 0;
    });
}

// load immediately
loadDailyStats();

// ⭐ auto refresh popup if storage changes
chrome.storage.onChanged.addListener(() => {
    loadDailyStats();
});

document.getElementById("openTotal").onclick = () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("total.html")
    });
};
