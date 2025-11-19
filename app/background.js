// Listens for a download request from content-script.js and initiates the file download.
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "downloadImage" && request.url) {
        chrome.downloads.download({
            url: request.url,
            filename: request.url.substring(request.url.lastIndexOf('/') + 1),
            saveAs: false
        });
        return true;
    }
});

// Sets the default value of the isDblClickEnabled to 'true' upon first installation.
const storageKey = 'isDblClickEnabled'
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        [storageKey]: true
    });
});