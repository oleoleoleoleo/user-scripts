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
            const alreadyExists = parentOfParent.getElementsByClassName(className);
            const voteValue = card.innerText;
            if (voteValue && !alreadyExists.length) {
                const voteEl = document.createElement('p');
                voteEl.className = className;
                voteEl.style.position = 'absolute';
                voteEl.style.left = '50px'
                voteEl.style.top = '-21px'
                voteEl.style.color = 'black'
                voteEl.style.border = '2px solid black'
                voteEl.style.padding = '2px 4px'
                voteEl.innerHTML = voteValue;
                parentOfParent.appendChild(voteEl);
            }

        })
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
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