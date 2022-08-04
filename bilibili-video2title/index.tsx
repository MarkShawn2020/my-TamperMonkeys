import { wait, waitAll } from "../utils";

let data: HTMLElement[] = [];



(async function () {
    'use strict';

    let eles = await waitAll<HTMLElement>("#submit-video-list .list-list li");
    eles.forEach(updateVideoItem)

    new MutationObserver(async () => {
        const newEles = await waitAll<HTMLElement>("#submit-video-list .list-list li", 0);
        if (newEles.length !== eles.length || newEles[0].getAttribute('data-aid') !== eles[0].getAttribute('data-aid'))
            newEles.forEach(updateVideoItem)

        eles = newEles
    }).observe(document, { subtree: true, childList: true })

    while (1) {
        let eleNext = await wait<HTMLElement>(".be-pager-next");
        if (eleNext.classList.contains("be-pager-disabled")) break;
        console.log("clicking next page");
        eleNext.click()
    }

    const root = await wait<HTMLElement>("#submit-video-list .list-list")
    root.replaceChildren(...data)
    console.log({data});

})();


function updateVideoItem(ele: HTMLElement) {
    const s = ele.querySelector(".title") as HTMLElement
    // console.log(s.title);
    ele.style.padding = "0px 0px"
    ele.replaceChildren(s);

    data.push(ele);
}