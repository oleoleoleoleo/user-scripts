// ==UserScript==
// @name         whatsapp helper, increase emoji bar
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  increase emoji bar
// @author       oleoleoleoleo
// @match        https://web.whatsapp.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const stretchEmojiBar = () => {

        setTimeout(() => {
            const emojiBar = document.querySelector('body > div.x1omtkq1.x10l6tqk.x1lliihq')

            if (emojiBar) {
                emojiBar.style.width = 'fit-content';
                emojiBar.style.left = '35%';
            }
        }, 20);
    };

    const addListenerToKeyUp = () => {
        const main = document.querySelector("#main");

        if (!main) {
            return;
        }

        const textarea = main.querySelector(`div[contenteditable="true"]`);
        textarea.removeEventListener('keyup', stretchEmojiBar);
        textarea.addEventListener('keyup', stretchEmojiBar);
    };

    const removeInstallForWindowsDiv = () => {
        const sideDivs = document.querySelectorAll('#side > div');
        const installForWindowsDiv = sideDivs[sideDivs.length - 1];

        if (installForWindowsDiv && installForWindowsDiv.innerText === 'Get WhatsApp for Windows') {
            installForWindowsDiv.remove();
        }
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                addListenerToKeyUp();
                removeInstallForWindowsDiv();
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);

    addListenerToKeyUp();
})();