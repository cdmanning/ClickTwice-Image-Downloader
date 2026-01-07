let currentMode = null;

function handleDownload(event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        event.preventDefault();
        event.stopPropagation();
        const imageUrl = target.src;
        if (imageUrl) {
            chrome.runtime.sendMessage({
                action: "downloadImage",
                url: imageUrl
            });
            target.style.transition = 'box-shadow 0.3s ease-out';
            target.style.boxShadow = `0 0 18px 3px #39FF14`;
            setTimeout(() => {
                target.style.boxShadow = 'none';
            }, 600);
        }
    }
}

function removeListeners() {
    document.removeEventListener('click', handleDownload, true);
    document.removeEventListener('dblclick', handleDownload, true);
}

chrome.storage.local.get(['isOnClickDownloadEnabled', 'clickType'], (result) => {
    const isEnabled = result.isOnClickDownloadEnabled !== false;
    const mode = result.clickType || 'dblclick';
    removeListeners();
    if (isEnabled) {
        document.addEventListener(mode, handleDownload, true);
    }
});

chrome.runtime.onMessage.addListener((message) => {
    const isEnabled = message.isEnabled;
    const mode = message.clickType;
    removeListeners();
    if (isEnabled && mode) {
        document.addEventListener(mode, handleDownload, true);
    }
});