const injectCaptionStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
        .caption-window, .ytp-caption-window-bottom {
            background: rgba(100, 100, 100, 0.1) !important;
            backdrop-filter: blur(3px) brightness(85%) !important;
            border-radius: 1em !important;
            padding: 1em !important;
            box-shadow: #0006 0 0 20px !important;
            width: fit-content !important;
        }
        .ytp-caption-segment {
            background-color: transparent !important;

        }
  `;
    document.head.appendChild(style);

}


const captionObserevr = () => {
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes.length > 0) {
                if (document.querySelector('.caption-window')) {
                    injectCaptionStyle();
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

captionObserevr();