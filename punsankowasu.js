// ==UserScript==
// @name         チャンネルポイント自動交換
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  
// @author       GRDIMPCT
// @match        *://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_REWARD = "大自然のゆたぷん"; // 任意の報酬名に変更（例.大自然のゆたぷん）

    let isProcessing = false;
    let firstLoad = true;
    let cachedMenuButton = null;
    let cachedRewardButton = null;
    let cachedConfirmButton = null;

    function startAfterDelay() {
        setTimeout(() => {
            firstLoad = false;
            openChannelPointsMenu();
        }, 10000);
    }

    function openChannelPointsMenu() {
        isProcessing = true;
        if (!cachedMenuButton || !document.body.contains(cachedMenuButton)) {
            cachedMenuButton = document.querySelector('[data-test-selector="community-points-summary"] button');
        }
        if (cachedMenuButton) {
            cachedMenuButton.click();
            requestAnimationFrame(clickRewardButton);
        } else {
            setTimeout(openChannelPointsMenu, 100);
        }
    }

    function clickRewardButton() {
        if (!isProcessing) return;
        if (!cachedRewardButton || !document.body.contains(cachedRewardButton)) {
            let rewardImage = document.querySelector(`button img[alt='${TARGET_REWARD}']`);
            if (rewardImage) {
                cachedRewardButton = rewardImage.closest("button");
            }
        }
        if (cachedRewardButton) {
            cachedRewardButton.click();
            requestAnimationFrame(clickConfirmButton);
        } else {
            setTimeout(clickRewardButton, 100);
        }
    }

    function clickConfirmButton() {
        if (!isProcessing) return;
        if (!cachedConfirmButton || !document.body.contains(cachedConfirmButton)) {
            let confirmButton = [...document.querySelectorAll("button")].find(button => button.innerText.includes("交換"));
            if (confirmButton) {
                cachedConfirmButton = confirmButton;
            }
        }
        if (cachedConfirmButton) {
            cachedConfirmButton.click();
            setTimeout(reopenMenu, 500);
        } else {
            setTimeout(clickConfirmButton, 100);
        }
    }

    function reopenMenu() {
        isProcessing = false;
        openChannelPointsMenu();
    }

    startAfterDelay();
})();
