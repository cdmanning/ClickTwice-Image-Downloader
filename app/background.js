// Listens for a download request from content-script.js and initiates the file download.
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "downloadImage" && request.url) {
        chrome.storage.local.get(['subFolder'], (data) => {
            const folder = data.subFolder ? data.subFolder.trim() : "";
            const originalFileName = request.url.substring(request.url.lastIndexOf('/') + 1);
            const finalPath = folder !== "" 
                ? `${folder}/${originalFileName}` 
                : originalFileName;
            chrome.downloads.download({
                url: request.url,
                filename: finalPath,
                conflictAction: 'uniquify',
                saveAs: false
            });
        });
        return true;
    }
});

const statusKey = 'isOnClickDownloadEnabled';
const modeKey = 'clickType';
const folderKey = 'subFolder';
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        [statusKey]: true,
        [modeKey]: 'dblclick',
        [folderKey]: 'ClickTwice'
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab?.url?.startsWith('http')) {
            chrome.storage.local.get(['isOnClickDownloadEnabled', 'clickType'], (data) => {
                const isEnabled = data.isOnClickDownloadEnabled ?? true;
                const mode = data.clickType ?? 'dblclick';
                chrome.tabs.sendMessage(tab.id, {
                    isEnabled: isEnabled,
                    clickType: mode
                }, () => { if (chrome.runtime.lastError) {} });
            });
        }
    });
});