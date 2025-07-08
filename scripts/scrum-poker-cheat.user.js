// ==UserScript==
// @name         scrumpoker-online cheatz
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  reveal votes in scrumpoker-online
// @author       oleoleoleoleo
// @match        https://www.scrumpoker-online.org/*
// @match        https://scrumpoker-online.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const className = 'vote-cheatz';

    const revealAllVotes = () => {
        const allCardBacks = document.getElementsByClassName('flip-card-back');
        Array.from(allCardBacks).forEach((card) => {
            const parentOfParent = card.parentElement.parentElement;
            const alreadyExists = parentOfParent.querySelector(`.${className}`);
            const voteValue = card.innerText;
            const isUpToDate = voteValue && alreadyExists?.innerText === voteValue;

            if (isUpToDate) {
                return;
            }

            if (!voteValue) {
                alreadyExists?.remove();
                return;
            }

            if (!alreadyExists) {
                const voteEl = document.createElement('p');
                voteEl.className = className;
                voteEl.style.position = 'absolute';
                voteEl.style.left = '50px';
                voteEl.style.top = '-21px';
                voteEl.style.color = 'black';
                voteEl.style.border = '2px solid black';
                voteEl.style.padding = '2px 4px';
                voteEl.innerHTML = voteValue;
                parentOfParent.appendChild(voteEl);
            } else {
                alreadyExists.innerHTML = voteValue;
            }

        })
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                revealAllVotes();
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);

    revealAllVotes();
})();