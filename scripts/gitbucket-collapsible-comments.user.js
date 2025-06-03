// ==UserScript==
// @name         improve bitbucket experience
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

    const addButtons = () => {
        const allComments = document.querySelectorAll('.commented-activity');
        for (let i = allComments.length - 1; i > -1; i--) {
            const comment = allComments[i];
            const alreadyExists = comment.getElementsByClassName(className).length;
            const isGeneralComment = !comment.getElementsByClassName('activity-content').length;
            let appendableElement = comment.querySelector('.user-avatar')

            if (alreadyExists || isGeneralComment || !appendableElement) {
                return;
            };

            appendableElement = appendableElement.parentElement;

            const hideableElements = [
                comment.querySelector('.file-comment'),
                Array.from(comment.querySelectorAll('.comment-content')),
                Array.from(document.querySelectorAll('.comment'))
            ].flat().filter(x => !!x);

            // see/hide button
            const button = document.createElement('p');
            button.innerText = 'see/hide';
            button.style.marginLeft = '4rem';
            button.style.marginRight = '2rem';
            button.style.cursor = 'pointer';
            button.className = className;

            const hide = () => {
                for(hideable of hideableElements) {
                    hideable.style.visibility = 'hidden';
                }
                comment.style.height = '20px';
            };

            const show = () => {
                for(hideable of hideableElements) {
                    hideable.style.visibility = '';
                }
                comment.style.height = '';
            };

            button.onclick = () => {
                if (hideableElements[0].style.visibility === 'hidden') {
                    show();
                    return;
                };
                
                hide();
            };

            // DONE checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const commentId = `${window.location.href}-comment-${i}`;
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

            appendableElement.appendChild(button);
            appendableElement.appendChild(label);
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