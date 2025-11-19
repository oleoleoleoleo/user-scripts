// ==UserScript==
// @name         de-clutter reddit
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  Remove annoying elements from Reddit
// @author       oleoleoleoleo
// @match        https://reddit.com/*
// @match        https://www.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 960px) {
      .s\\:\\[\\&\\.fixed-sidebar\\]\\:grid-cols-\\[minmax\\(0\\2c 756px\\)\\_minmax\\(0\\2c 316px\\)\\].fixed-sidebar {
        grid-template-columns: initial !important;
      }
    }
  `;
  document.head.appendChild(style);

  const selectors = [
    'faceplate-tracker[source="nav"]:not([noun="login"]):not([noun="reddit_logo"]):not([noun="chat"]):not([noun="inbox"])',
    'left-nav-top-section',
  ];

  function removeElements() {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.remove();
        }
      });
    });

    const shadowHosts = document.querySelectorAll('*');
    shadowHosts.forEach(host => {
      if (host.shadowRoot) {
        selectors.forEach(selector => {
          const elements = host.shadowRoot.querySelectorAll(selector);
          elements.forEach(el => {
            if (el && el.parentNode) {
              el.remove();
            }
          });
        });
      }
    });
  }

  const observer = new MutationObserver(() => {
    removeElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  removeElements();
  window.addEventListener('load', removeElements);
})();
