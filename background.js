chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ reelCount: 0 });
});
