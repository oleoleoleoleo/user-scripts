// ==UserScript==
// @name         make gitbucket less poop
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  add see/hide button for gitbucket PR comments
// @author       oleoleoleoleo
// @include      *://*git.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const className = 'see-hide-button';

    const hashString = (text) => {
        let hash = 5381;
        for (let i = 0; i < text.length; i++) {
            hash = (hash * 33) ^ text.charCodeAt(i);
        }
        return (hash >>> 0).toString(36);
    }

    const addButtons = () => {
        const allComments = document.querySelectorAll('.commented-activity');
        for (const comment of allComments) {
            if (comment.getElementsByClassName(className).length) {
                return;
            }

            // see/hide button
            const button = document.createElement('p');
            button.innerText = 'see/hide';
            button.style.marginLeft = '4rem';
            button.style.cursor = 'pointer';
            button.className = className;

            const callBack = () => {
                if (comment.lastChild.style.visibility === 'hidden') {
                    comment.lastChild.style.visibility = '';
                    comment.style.height = '';
                    return;
                }
                comment.lastChild.style.visibility = 'hidden';
                comment.style.height = '20px';
            }

            button.onclick = callBack;

            // DONE checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'my-checkbox';
            checkbox.style.marginRight = '0.5em';

            const commentId = hashString(comment.innerText.slice(0, 200));
            const savedValue = GM_getValue(commentId, false);
            checkbox.checked = savedValue;

            checkbox.addEventListener('change', () => {
                GM_setValue(id, checkbox.checked);
            });

            const label = document.createElement('label');
            label.textContent = ' Done? ';
            label.appendChild(checkbox);


            comment.firstChild.appendChild(button);
            comment.firstChild.appendChild(label);
        }

    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                addButtons();
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);

    addButtons();
})();