document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const modeKeySelect = document.getElementById('clickType');
    const folderInput = document.getElementById('subFolder');
    const footerText = document.querySelector('.status-bar span');
    const settingsSection = document.querySelector('.settings-section');
    const logoIcon = document.querySelector('.logo');
    const statusKey = 'isOnClickDownloadEnabled';
    const modeKey = 'clickType';
    const folderKey = 'subFolder'

    function notifyContentScript(enabled, mode) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab?.id && activeTab.url?.startsWith('http')) {
                chrome.tabs.sendMessage(activeTab.id, {
                    isEnabled: enabled,
                    clickType: mode
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.info("ClickTwice: Content script not active on this page. This is the standard behavior for internal and system pages");
                    }
                });
            }
        });
    }

    function updateUI(isEnabled) {
        toggleSwitch.checked = isEnabled;
        settingsSection.classList.toggle('hidden', !isEnabled);
        if (isEnabled) {
            footerText.textContent = "Monitoring active tabs";
            footerText.style.color = "var(--neon-green)";
            logoIcon.style.filter = "drop-shadow(0 0 4px var(--neon-blue))";
        } else {
            footerText.textContent = "Monitoring paused";
            footerText.style.color = "var(--neon-yellow)";
            logoIcon.style.filter = "none";
        }

    }

    chrome.storage.local.get([statusKey, modeKey, folderKey], (data) => {
        const isEnabled = data[statusKey] ?? true;
        const mode = data[modeKey] ?? 'dblclick';
        const folder = data[folderKey] ?? 'ClickTwice';
        updateUI(isEnabled);
        modeKeySelect.value = mode;
        folderInput.value = folder;
        setTimeout(() => {
            document.body.classList.remove('preload');
        }, 100);
    });

    toggleSwitch.addEventListener('change', () => {
        const newState = toggleSwitch.checked;
        updateUI(newState);
        chrome.storage.local.set({ [statusKey]: newState });
        const currentMode = modeKeySelect.value;
        notifyContentScript(newState, currentMode);
    });

    modeKeySelect.addEventListener('change', () => {
        const newMode = modeKeySelect.value;
        chrome.storage.local.set({ [modeKey]: newMode });

        chrome.storage.local.get(statusKey, (data) => {
            notifyContentScript(data[statusKey] ?? true, newMode);
        });
    });

    folderInput.addEventListener('input', () => {
        let sanitizedValue = folderInput.value.replace(/[?%*:|"<>]/g, '');
        sanitizedValue = sanitizedValue.replace(/^\/+|\/+$/g, '');
        folderInput.value = sanitizedValue;
        const folderName = folderInput.value.trim();
        chrome.storage.local.set({ [folderKey]: folderName });
    });

});