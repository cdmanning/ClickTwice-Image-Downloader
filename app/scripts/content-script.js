function handleDoubleClick(event) {
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
            target.style.boxShadow = '0 0 18px 3px #66BB6A';
            setTimeout(() => {
                target.style.boxShadow = 'none';
            }, 600);
        }
    }
}

// On-load checks if the dblclick listener should be added
chrome.storage.local.get('isDblClickEnabled', (result) => {
    const isEnabled = result.isDblClickEnabled !== false;
    if (isEnabled) {
        document.addEventListener('dblclick', handleDoubleClick, true);
    }
});

// Receives message from popup and adds/removes the dblclick listener
chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (typeof message.isDblClickEnabled === 'boolean') {
        if (message.isDblClickEnabled) {
            document.addEventListener('dblclick', handleDoubleClick, true);
        } else {
            document.removeEventListener('dblclick', handleDoubleClick, true);
        }
    }
});