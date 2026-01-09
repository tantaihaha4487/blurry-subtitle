// Default settings
const DEFAULTS = {
    enabled: true,
    transparency: 10,
    textColor: '#ffffff',
    blurBoxColor: '#646464'
};

// Current settings (will be loaded from storage)
let currentSettings = { ...DEFAULTS };

// Convert hex color to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 100, g: 100, b: 100 };
};

// Generate and inject styles based on settings
const injectCaptionStyle = (settings) => {
    // Remove existing style if present
    const existingStyle = document.getElementById('blurry-subtitle-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    // If disabled, don't inject any styles
    if (!settings.enabled) {
        return;
    }

    const { transparency, textColor, blurBoxColor } = settings;
    const boxRgb = hexToRgb(blurBoxColor);
    const alpha = transparency / 100;

    const style = document.createElement('style');
    style.id = 'blurry-subtitle-style';
    style.textContent = `
    .caption-window, .ytp-caption-window-bottom {
      background: rgba(${boxRgb.r}, ${boxRgb.g}, ${boxRgb.b}, ${alpha}) !important;
      backdrop-filter: blur(3px) brightness(85%) !important;
      border-radius: 1em !important;
      padding: 1em !important;
      box-shadow: #0006 0 0 20px !important;
      width: fit-content !important;
      transition: opacity 0.3s linear, backdrop-filter 0.3s linear, background 0.3s linear;
    }
    .ytp-caption-segment {
      background-color: transparent !important;
      color: ${textColor} !important;
    }
  `;
    document.head.appendChild(style);
};

// Load settings from storage and apply
const loadAndApplySettings = async () => {
    try {
        const result = await browser.storage.local.get(DEFAULTS);
        currentSettings = result;
        injectCaptionStyle(currentSettings);
    } catch (e) {
        // Fallback to defaults if storage fails
        injectCaptionStyle(DEFAULTS);
    }
};

// Listen for storage changes
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        for (const key of Object.keys(changes)) {
            currentSettings[key] = changes[key].newValue;
        }
        injectCaptionStyle(currentSettings);
    }
});

// Observer for caption elements
const captionObserver = () => {
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes.length > 0) {
                if (document.querySelector('.caption-window')) {
                    loadAndApplySettings();
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

// Initialize
loadAndApplySettings();
captionObserver();