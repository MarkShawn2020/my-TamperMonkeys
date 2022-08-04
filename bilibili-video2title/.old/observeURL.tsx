// ==UserScript==
// @name         哔哩哔哩视频列表页纯文字显示
// @version      0.1
// @match        https://space.bilibili.com/*/video*
// @require      file:///Users/mark/mark_keeps_learning/core/softwares/TamperMonkey/bilibili-video2title/dist/bundle.js
// @description  Think Different!
// @author       MarkShawn2020
// @namespace    http://tampermonkey.net/
// ==/UserScript==

import { waitAll } from "../../utils";



(async function () {
    'use strict';

    await readVideoList()

    let lastUrl = location.href;
    new MutationObserver(async () => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(onUrlChange, 3000)
        }
    }).observe(document, { subtree: true, childList: true });


})();



async function onUrlChange() {
    console.log('URL changed!', location.href);
    await readVideoList()
}

async function readVideoList() {
    const eles = await waitAll<HTMLElement>("#submit-video-list .list-list li");

    eles.forEach(ele => {
        const s = ele.querySelector(".title") as HTMLElement
        // console.log(s.title);
        ele.style.padding = "0px 0px"
        ele.replaceChildren(s);
    })
}