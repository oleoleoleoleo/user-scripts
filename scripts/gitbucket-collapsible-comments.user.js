// ==UserScript==
// @name         make gitbucket less poop
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  add see/hide button for gitbucket PR comments
// @author       oleoleoleoleo
// @include      *://*git.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    const className = 'see-hide-button';

    const hashString = (text) => {
        let hash = 5381;
        for (let i = 0; i < text.length; i++) {
            hash = (hash * 33) ^ text.charCodeAt(i);
        };
        return (hash >>> 0).toString(36);
    };

    const addButtons = () => {
        const allComments = document.querySelectorAll('.commented-activity');
        for (const comment of allComments) {
            const alreadyExists = comment.getElementsByClassName(className).length;
            const isGeneralComment = !comment.getElementsByClassName('activity-content').length;

            if (alreadyExists || isGeneralComment) {
                return;
            };

            // see/hide button
            const button = document.createElement('p');
            button.innerText = 'see/hide';
            button.style.marginLeft = '4rem';
            button.style.marginRight = '2rem';
            button.style.cursor = 'pointer';
            button.className = className;

            const hide = () => {
                comment.lastChild.style.visibility = 'hidden';
                comment.style.height = '20px';
            };

            const show = () => {
                comment.lastChild.style.visibility = '';
                comment.style.height = '';
            };

            button.onclick = () => {
                if (comment.lastChild.style.visibility === 'hidden') {
                    show();
                    return;
                };
                
                hide();
            };

            // DONE checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const commentId = hashString(comment.innerText.slice(0, 300));
            const isDone = GM_getValue(commentId, false);
            checkbox.checked = isDone;

            if (isDone) {
                hide();
            };

            checkbox.addEventListener('change', () => {
                GM_setValue(commentId, checkbox.checked);
            });

            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            label.textContent = ' done ';
            label.appendChild(checkbox);

            comment.firstChild.appendChild(button);
            comment.firstChild.appendChild(label);
        };
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                addButtons();
            };
        });
    });

    const config = {
        childList: true,
        subtree: true,
    };

    observer.observe(document.body, config);

    addButtons();
})();