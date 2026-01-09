// Default settings
const DEFAULTS = {
    enabled: true,
    transparency: 10,
    textColor: '#ffffff',
    blurBoxColor: '#646464'
};

// DOM elements
const enableToggle = document.getElementById('enable-toggle');
const transparencySlider = document.getElementById('transparency-slider');
const transparencyValue = document.getElementById('transparency-value');
const textColorInput = document.getElementById('text-color');
const textColorPreview = document.getElementById('text-color-preview');
const boxColorInput = document.getElementById('box-color');
const boxColorPreview = document.getElementById('box-color-preview');
const resetAllBtn = document.getElementById('reset-all');
const resetBtns = document.querySelectorAll('.reset-btn');

// Validate hex color
function isValidHex(hex) {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// Update color preview
function updateColorPreview(input, preview) {
    const value = input.value;
    if (isValidHex(value)) {
        preview.style.backgroundColor = value;
    }
}

// Load settings from storage
async function loadSettings() {
    const result = await browser.storage.local.get(DEFAULTS);

    enableToggle.checked = result.enabled;
    transparencySlider.value = result.transparency;
    transparencyValue.textContent = `${result.transparency}%`;
    textColorInput.value = result.textColor;
    boxColorInput.value = result.blurBoxColor;

    // Update previews
    textColorPreview.style.backgroundColor = result.textColor;
    boxColorPreview.style.backgroundColor = result.blurBoxColor;
}

// Save a single setting
async function saveSetting(key, value) {
    await browser.storage.local.set({ [key]: value });
}

// Event listeners
enableToggle.addEventListener('change', (e) => {
    saveSetting('enabled', e.target.checked);
});

transparencySlider.addEventListener('input', (e) => {
    const value = e.target.value;
    transparencyValue.textContent = `${value}%`;
    saveSetting('transparency', parseInt(value));
});

textColorInput.addEventListener('input', (e) => {
    const value = e.target.value;
    updateColorPreview(textColorInput, textColorPreview);
    if (isValidHex(value)) {
        saveSetting('textColor', value.toLowerCase());
    }
});

boxColorInput.addEventListener('input', (e) => {
    const value = e.target.value;
    updateColorPreview(boxColorInput, boxColorPreview);
    if (isValidHex(value)) {
        saveSetting('blurBoxColor', value.toLowerCase());
    }
});

// Reset individual settings
resetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const setting = btn.dataset.setting;
        const defaultValue = DEFAULTS[setting];

        saveSetting(setting, defaultValue);

        // Update UI
        switch (setting) {
            case 'transparency':
                transparencySlider.value = defaultValue;
                transparencyValue.textContent = `${defaultValue}%`;
                break;
            case 'textColor':
                textColorInput.value = defaultValue;
                textColorPreview.style.backgroundColor = defaultValue;
                break;
            case 'blurBoxColor':
                boxColorInput.value = defaultValue;
                boxColorPreview.style.backgroundColor = defaultValue;
                break;
        }
    });
});

// Reset all settings
resetAllBtn.addEventListener('click', async () => {
    await browser.storage.local.set(DEFAULTS);
    loadSettings();
});

// Initialize
loadSettings();
