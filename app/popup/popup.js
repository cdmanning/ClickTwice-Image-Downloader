document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const storageKey = 'isDblClickEnabled';
    toggleSwitch.classList.add('no-transition');

    function setToggleClasses(isEnabled) {
        toggleSwitch.classList.toggle('toggle--on', isEnabled);
        toggleSwitch.classList.toggle('toggle--off', !isEnabled);
    }

    chrome.storage.local.get(storageKey, (data) => {
        const isEnabled = data[storageKey] ?? true;
        setToggleClasses(isEnabled);
        setTimeout(() => {
            toggleSwitch.classList.remove('no-transition');
        }, 50);
    });

    toggleSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        const currentState = toggleSwitch.classList.contains('toggle--on');
        const newState = !currentState;
        setToggleClasses(newState);
        toggleSwitch.classList.add('toggle--moving');
        setTimeout(() => toggleSwitch.classList.remove('toggle--moving'), 500);
        chrome.storage.local.set({ [storageKey]: newState });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    isDblClickEnabled: newState
                });
            }
        });
    });
});