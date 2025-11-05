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

  const buttonClassName = 'see-hide-button';
  const pullRequestId = document
    .querySelector('.branch-from-to')
    .textContent.replace(/[^A-Z0-9|-]/gi, '');
  const shouldIgnoreMutation = mutation => mutation.target.closest('.activity-content');

  const addButtons = () => {
    const allComments = document.querySelectorAll('.commented-activity');
    for (let i = 0; i < allComments.length; i++) {
      const comment = allComments[i];
      const alreadyExists = comment.getElementsByClassName(buttonClassName).length;
      const isGeneralComment = !comment.getElementsByClassName('activity-content').length;
      const userAvatar = comment.querySelector('.user-avatar');
      const rootComment = comment.querySelector('.is-root-comment');

      if (alreadyExists || isGeneralComment || !userAvatar || !rootComment) {
        continue;
      }

      const commmentWithId = rootComment.querySelector('.comment');
      const commentId = commmentWithId.getAttribute('data-comment-id');
      const monkeyId = `${pullRequestId}-${commentId}`;

      const appendableElement = userAvatar.parentElement;
      const hideableElement = comment.querySelector('.file-comment');

      // see/hide button
      const button = document.createElement('p');
      button.innerText = 'see/hide';
      button.style.cursor = 'pointer';
      button.className = buttonClassName;

      const hide = () => {
        hideableElement.style.visibility = 'hidden';
        comment.style.height = '20px';
      };

      const show = () => {
        hideableElement.style.visibility = '';
        comment.style.height = '';
      };

      button.onclick = () => {
        if (hideableElement.style.visibility === 'hidden') {
          show();
        } else {
          hide();
        }
      };

      // DONE checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      const isDone = GM_getValue(monkeyId, false);
      checkbox.checked = isDone;

      if (isDone) {
        hide();
      }

      checkbox.addEventListener('change', () => {
        GM_setValue(monkeyId, checkbox.checked);
      });

      const label = document.createElement('label');
      label.style.cursor = 'pointer';
      label.textContent = ' done ';
      label.appendChild(checkbox);

      // wrapper
      const monkeyDiv = document.createElement('div');
      monkeyDiv.style.display = 'flex';
      monkeyDiv.style.gap = '20px';
      monkeyDiv.style.paddingLeft = '20px';
      monkeyDiv.style.paddingRight = '20px';

      monkeyDiv.appendChild(button);
      monkeyDiv.appendChild(label);

      appendableElement.children[1].insertAdjacentElement('afterend', monkeyDiv);
    }
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && !shouldIgnoreMutation(mutation)) {
        addButtons();
      }
    }
  });

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, config);

  addButtons();
})();
