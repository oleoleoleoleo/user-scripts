// ==UserScript==
// @name         anchor element enhancer
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  makes links more visible
// @author       oleoleoleoleo
// @match        https://www.thewikigamedaily.com/*
// @match        https://www.thewikigame.com/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const getAnchorElements = () => {
        const output = []
        output.push(Array.from(document.querySelectorAll('a')));
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentDocument) {
            output.push(Array.from(iframe.contentDocument.querySelectorAll('a')));
        }
        return output.flat();
    }

    const applyLinkStyles = () => {
        getAnchorElements().forEach(function (a) {
            a.style.color = '#ef1a02';
            a.style.backgroundColor = '#ecff26';
            a.style.textShadow = '0 0 1px currentColor';
        });
    }

    const observer = new MutationObserver((mutations) => {

        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                applyLinkStyles();

                setTimeout(() => {
                    applyLinkStyles();
                }, 200);
            }
        });
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);

    applyLinkStyles();

})();