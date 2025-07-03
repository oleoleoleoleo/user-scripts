// ==UserScript==
// @name         youtube enhancer
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  makes links more visible
// @author       oleoleoleoleo
// @match        *://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict'

    const clazz = 'tampered';
    const tamperTag = 'isthisevenavalidhtmltag';

    const tamperWithStyleSheets = () => {
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText === 'ytd-rich-item-renderer[rendered-from-rich-grid]') {
                        rule.style.width = '15%';
                    }
                }
            } catch (e) {
                continue;
            }
        }
    }

    const hackText = () => {
        const allItems = document.querySelectorAll('ytd-rich-item-renderer');

        for (const relevantElement of allItems) {
            if (relevantElement.querySelector(tamperTag)) {
                continue;
            }

            // do h3 first (make it hidden, add another element with text content)
            const titleAnchor = relevantElement.querySelector('h3 > a');
            const ytTitle = titleAnchor?.querySelector('yt-formatted-string');

            if (ytTitle) {
                const text = ytTitle.textContent;

                ytTitle.style.display = 'none';

                const customTitle = document.createElement(tamperTag);
                customTitle.textContent = text;
                customTitle.style.fontSize = '1.2rem';
                customTitle.style.color = 'inherit'; // optional: keep original color
                customTitle.style.display = 'inline';

                ytTitle.parentElement.appendChild(customTitle);
            }

            // move channel name link
            const textContainer = relevantElement.querySelector('#metadata #byline-container #channel-name #container #text-container');
            const ytText = textContainer?.querySelector('#text');
            const channelLink = ytText?.querySelector('a');

            if (ytText && channelLink && textContainer) {
                channelLink.style.fontSize = '1rem';
                textContainer.appendChild(channelLink);
                ytText.style.display = 'none';
            }

            // tamper with metadata-line
            const metadataLine = relevantElement.querySelector('#metadata-line');
            if (metadataLine) {
                metadataLine.style.display = 'none';

                const replacement = document.createElement('p');
                replacement.textContent = metadataLine.textContent;
                replacement.style.fontSize = '1rem';
                replacement.style.margin = '0';
                replacement.style.color = 'greenyellow';

                metadataLine.parentElement.appendChild(replacement)

            }
        }
    }

    const hideShorts = () => {
        const shortBanners = document.querySelectorAll('ytd-rich-section-renderer');
        for (const short of shortBanners) {
            short.classList.add(clazz);
            short.style.visibility = 'hidden';
            short.style.height = '0px';
            short.style.display = 'none';
        }
    }


    const observer = new MutationObserver((mutations) => {

        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                hideShorts();
                hackText();

            }
        });
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);

    tamperWithStyleSheets();
    hideShorts();
    hackText();

}
)()