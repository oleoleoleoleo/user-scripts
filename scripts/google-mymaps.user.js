// ==UserScript==
// @name         mymaps helper
// @namespace    oleoleoleoleo
// @version      1.0.0
// @description  links to map and street view from mymaps
// @author       oleoleoleoleo
// @match        https://www.google.com/mymaps/*
// @match        https://www.google.com/maps/d/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const tamperedClass = 'tampered';

  const mainContainerSelector = '#map-infowindow-container';
  const coordinatesSelector = '#infowindow-measurements';

  const streetViewIcon = '🚶';
  const mapIcon = '📍';

  const addLinks = () => {
    const infoContainer = document.querySelector(mainContainerSelector);

    if (!infoContainer || infoContainer.classList.contains(tamperedClass)) {
      return;
    }

    infoContainer.classList.add(tamperedClass);

    const coordinatesContainer = infoContainer.querySelector(coordinatesSelector);
    flexify(coordinatesContainer);

    const [lat, lon] = getCoordinates(coordinatesContainer);
    const [streetViewUrl, mapsUrl] = getUrls(lat, lon);
    const mapsLi = createAnchorLi(mapsUrl, mapIcon);
    const streetViewLi = createAnchorLi(streetViewUrl, streetViewIcon);

    coordinatesContainer.appendChild(mapsLi);
    coordinatesContainer.appendChild(streetViewLi);
  };

  const flexify = container => {
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
  };

  const getCoordinates = container => {
    const coordinates = container.textContent;
    return coordinates.split(', ');
  };

  const getUrls = (lat, lon) => {
    return [
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`,
      `https://www.google.com/maps?q=${lat},${lon}`,
    ];
  };

  const createAnchorLi = (url, label) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.innerHTML = label;
    a.style.textDecoration = 'none';
    li.appendChild(a);
    return li;
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        addLinks();
      }
    });
  });

  const config = { childList: true, subtree: true };

  observer.observe(document.body, config);

  addLinks();
})();
