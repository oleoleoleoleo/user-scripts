// ==UserScript==
// @name         bitbucket enhancer
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  add see/hide button for gitbucket PR comments, hover to see commits
// @author       oleoleoleoleo
// @include      *://*git.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  let floatingRoot;

  const allCommentsSelector = '.commented-activity';
  const selectorWrapper = '.rescoped-activity';
  const selectorTitle = '.activity-content';
  const selectorBody = '.commits-table-wrapper';

  const hideDelay = 150;

  const beenTampered = 'been-tampered';
  const buttonClassName = 'see-hide-button';
  const hiddenAttribute = 'hidden-in-place';
  const pullRequestId = document
    .querySelector('.branch-from-to')
    .textContent.replace(/[^A-Z0-9|-]/gi, '');
  const shouldIgnoreMutation = (mutation) =>
    mutation.target.closest('.activity-content');

  const addStyleSheet = () => {
    const style = document.createElement('style');
    style.textContent = `
    .floating-body {
      position: absolute;
      z-index: 999999;
      min-width: 120px;
      max-width: 100vw;
      max-height: 70vh;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(0,0,0,0.2);
      background: white;
      border: 1px solid black;
      border-radius: 5px;
    }

    .custom-button {
      background-color: rgba(0,0,0,0.2);
      border: 1px solid black;
      border-radius: 5px;
      padding: 2px 5px;
      margin: 0 5px;
      cursor: pointer;
    }

    .button-container {
      display: flex;
      gap: 20px;
      padding: 0 20px;
      margin: 0 20px;
    }
    
    .clickable {
      cursor: pointer;
    }

    ${selectorWrapper} ${selectorBody}[${hiddenAttribute}] {
      display: none !important;
    }
  `;

    document.head.appendChild(style);
  };

  const setupFloatingRoot = () => {
    floatingRoot = document.createElement('div');
    floatingRoot.style.width = '100vw';
    document.body.appendChild(floatingRoot);
  };

  const addHoverableCommits = () => {
    const allCommitComments = document.querySelectorAll(selectorWrapper);

    for (let i = 0; i < allCommitComments.length; i++) {
      const comment = allCommitComments[i];
      const commentTitle = comment.querySelector(selectorTitle);
      const commentBody = comment.querySelector(selectorBody);
      const alreadyThere = comment.querySelector(`.${beenTampered}`);

      if (!commentTitle || !commentBody || alreadyThere) {
        continue;
      }

      commentBody.setAttribute('hidden-in-place', 'true');
      commentBody.classList.add(beenTampered);

      const placeholder = document.createComment('body-placeholder');
      let hideTimer = null;
      let floating = null;

      const showFloating = () => {
        if (floating && floating.contains(commentBody)) {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
          return;
        }

        if (commentBody.parentNode === comment) {
          comment.replaceChild(placeholder, commentBody);
        }

        floating = document.createElement('div');
        floating.className = 'floating-body';
        floating.setAttribute('data-from-wrapper', '');

        commentBody.removeAttribute('hidden-in-place');
        commentBody.style.display = '';
        floating.appendChild(commentBody);

        positionFloatingNextToTitle(floating, commentTitle);

        floatingRoot.appendChild(floating);

        floating.addEventListener('mouseenter', cancelHide);
        floating.addEventListener('mouseleave', scheduleHide);
      };

      const hideFloatingNow = () => {
        if (!floating) {
          return;
        }

        commentBody.setAttribute('hidden-in-place', 'true');
        commentBody.style.display = '';
        commentBody.style.width = '95%';

        if (placeholder.parentNode === comment) {
          comment.replaceChild(commentBody, placeholder);
        } else {
          comment.appendChild(commentBody);
        }

        if (floating.parentNode) {
          floating.parentNode.removeChild(floating);
        }
        floating = null;
      };

      const scheduleHide = () => {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          hideTimer = null;
          hideFloatingNow();
        }, hideDelay);
      };

      const cancelHide = () => {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
      };

      const positionFloatingNextToTitle = (floatingEl, titleEl) => {
        const rect = titleEl.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        let left = rect.left + scrollX;
        let top = rect.bottom + scrollY + 6;

        const maxWidth = Math.min(window.innerWidth * 0.8, 600);
        floatingEl.style.minWidth = Math.max(rect.width, 120) + 'px';
        floatingEl.style.maxWidth = maxWidth + 'px';

        floatingEl.style.visibility = 'hidden';
        document.body.appendChild(floatingEl);
        const fRect = floatingEl.getBoundingClientRect();

        if (left + fRect.width > scrollX + window.innerWidth) {
          left = Math.max(
            scrollX + window.innerWidth - fRect.width - 8,
            scrollX + 4
          );
        }

        if (top + fRect.height > scrollY + window.innerHeight) {
          const altTop = rect.top + scrollY - fRect.height - 6;
          if (altTop > scrollY) top = altTop;
        }

        floatingEl.style.left = Math.round(left) + 'px';
        floatingEl.style.top = Math.round(top) + 'px';
        floatingEl.style.visibility = 'visible';
      };

      const hoverable = document.createElement('div');
      hoverable.className = 'custom-button';
      hoverable.innerText = 'multiple commits';

      hoverable.addEventListener('mouseenter', () => {
        cancelHide();
        showFloating();
      });
      hoverable.addEventListener('mouseleave', scheduleHide);

      commentTitle.appendChild(hoverable);

      window.addEventListener(
        'scroll',
        () => {
          if (floating && floating.contains(commentBody)) {
            positionFloatingNextToTitle(floating, commentTitle);
          }
        },
        { passive: true }
      );

      window.addEventListener('resize', () => {
        if (floating && floating.contains(commentBody)) {
          positionFloatingNextToTitle(floating, commentTitle);
        }
      });
    }
  };

  const addButtons = () => {
    const allComments = document.querySelectorAll(allCommentsSelector);
    for (let i = 0; i < allComments.length; i++) {
      const comment = allComments[i];
      const alreadyExists =
        comment.getElementsByClassName(buttonClassName).length;
      const isGeneralComment =
        !comment.getElementsByClassName('activity-content').length;
      const userAvatar = comment.querySelector('.user-avatar');
      const rootComment = comment.querySelector('.is-root-comment');

      if (alreadyExists || isGeneralComment || !userAvatar || !rootComment) {
        continue;
      }

      const commmentWithId = rootComment.querySelector('.comment');
      const commentId = commmentWithId.getAttribute('data-comment-id');
      const tamperId = `${pullRequestId}-${commentId}`;

      const appendableElement = userAvatar.parentElement;
      const hideableElement = comment.querySelector('.file-comment');

      // see/hide button
      const button = document.createElement('p');
      button.innerText = 'see/hide';
      button.classList.add(buttonClassName);
      button.classList.add('custom-button');

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

      const isDone = GM_getValue(tamperId, false);
      checkbox.checked = isDone;

      if (isDone) {
        hide();
      }

      checkbox.addEventListener('change', () => {
        GM_setValue(tamperId, checkbox.checked);
      });

      const label = document.createElement('label');
      label.className = 'custom-button';
      label.innerText = ' done ';
      label.appendChild(checkbox);

      // wrapper
      const monkeyDiv = document.createElement('div');
      monkeyDiv.className = 'button-container';

      monkeyDiv.appendChild(button);
      monkeyDiv.appendChild(label);

      appendableElement.children[1].insertAdjacentElement(
        'afterend',
        monkeyDiv
      );
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && !shouldIgnoreMutation(mutation)) {
        addButtons();
        addHoverableCommits();
      }
    }
  });

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, config);

  setupFloatingRoot();
  addStyleSheet();
  addHoverableCommits();
  addButtons();
})();
