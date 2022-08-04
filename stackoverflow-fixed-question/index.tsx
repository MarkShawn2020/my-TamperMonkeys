import React from "react";
import { flushSync } from "react-dom";
import ReactDOM from "react-dom/client"
import { CompTag } from "../CompTag";

import { wait, waitAll } from "../utils";

export declare type GM_VALID_KEY_TYPE = string;
export declare type GM_VALID_VAL_TYPE = string | number | boolean;
export declare function GM_getValue(k: GM_VALID_KEY_TYPE, v?: GM_VALID_VAL_TYPE): GM_VALID_VAL_TYPE;
export declare function GM_setValue(k: GM_VALID_KEY_TYPE, v: GM_VALID_VAL_TYPE): void;

const KEY_DISCUSSIONS = "discussions";

let eleTbody: HTMLElement = undefined;
let enableNextPage: boolean = true;


(async function () {

    if (window.location.href.includes("start=0")) {
        GM_setValue(KEY_DISCUSSIONS, "")
    }

    // 1. 移除广告
    removeAd()

    // 2. 移动群公告（否则我们不能第一时间看到帖子列表）
    moveGroupBoard()

    // 3. 增加签名
    addSlogan()

    // 4. （主）筛选帖子
    await initDiscussions()
    await handleDiscussions()

    // 5. 翻页，并循环4
    await navigatePages()

})()


async function removeAd() {
    const ads = await waitAll("div[ad-status]");
    ads.forEach(ad => ad.remove());
}

async function addSlogan() {
    const eleGroupDesc = await wait("#content h1")

    const eleMonkey = document.createElement("span")
    eleMonkey.innerText = "油猴无敌！"
    Object.assign(eleMonkey.style, { color: "red", marginLeft: "10px", fontStyle: "italic" })
    eleGroupDesc.insertAdjacentElement("beforeend", eleMonkey)

    // const eleSlogan = document.createElement("span")
    // eleSlogan.innerText = "-- Think Different."
    // Object.assign(eleSlogan.style, { transform: "rotate(-30deg)", transformOrigin: "center", display: "inline-block" })
    // eleGroupDesc.insertAdjacentElement("beforeend", eleSlogan)
}

async function moveGroupBoard() {
    const eleGroupBoard = await wait(".group-board")
    const eleSide = await wait(".aside")
    eleSide.querySelector(".mod").remove() // 这个`.mod`是最近加入的人，但这个类与主内容类一样，所以必须链式选中删除
    eleSide.insertAdjacentElement("beforeend", eleGroupBoard)
}

async function initDiscussions() {
    console.log("filtering discussions");

    eleTbody = await wait<HTMLElement>("#group-topics tr, #content .article tbody")
    let topic = await wait<HTMLElement>("tr", eleTbody) // query or, ref: https://stackoverflow.com/a/34001943/9422455
    topic.insertAdjacentHTML("afterbegin", '<td>状态标记</td>');
}

function handleDiscussionRow(topic: HTMLElement): string {
    let text = "", color = "#eee";
    const eleTitle: HTMLElement = topic.querySelector("a[title]")
    const matchPrice = eleTitle.title.match(/\d{2}00/)
    if (matchPrice !== null) {
        // console.log({ matchPrice });
        const matchedPrice = parseInt(matchPrice[0])

        if (2000 <= matchedPrice && matchedPrice <= 3000) {
            text = "WOW", color = "green";
        } else {
            color = "darkred";
            text = matchedPrice > 3000 ? "价格过高" : "价格过低";
            topic.querySelectorAll('td').forEach(
                (td: HTMLElement) => td.style.textDecoration = "line-through")
        }
    }

    // 使用react的办法，不太适合后期修改结点，所以放在最后操纵结点
    const newDomElement = document.createElement('td');
    topic.insertAdjacentElement("afterbegin", newDomElement);
    flushSync(() => {
        // 在react18里强制刷新，ref: https://stackoverflow.com/a/71983073/9422455
        ReactDOM.createRoot(newDomElement).render(<CompTag text={text} color={color} />)
    })

    return topic.outerHTML
}

async function handleDiscussions(fromSelector: Document | HTMLElement = document): Promise<string> {
    // 首页最小要8个，更多页最小要16个（15个一刷）
    // query or, ref: https://stackoverflow.com/a/34001943/9422455
    let discussions = await waitAll<HTMLElement>("#group-topics tr, #content .article tr:not(.th)", 20, fromSelector);
    console.log("topics found: ", discussions.length);
    const s = discussions.map(handleDiscussionRow).join("\n")
    console.log({ s });
    return s
}

async function navigatePages() {
    console.log("enable page navigation");


    const eleNext = await wait<HTMLElement>(".paginator .next a")

    // [FAILED] prevent refresh, ref: https://stackoverflow.com/a/13262305/9422455
    // eleNext.setAttribute("type", "button")

    eleNext.onclick = e => eventPagination(e, eleNext.getAttribute("href"))

    // detect whether the next btn is going to be visible, ref: https://stackoverflow.com/a/7557433/9422455
    // detect scroll, ref: https://stackoverflow.com/q/45191427/9422455
    window.onscroll = (async () => {
        const eleNextTop = eleNext.getBoundingClientRect().top
        const winInnerHeight = window.innerHeight
        const docClientHeight = document.documentElement.clientHeight
        console.log({ eleNextTop, winInnerHeight, docClientHeight });

        if (enableNextPage && eleNextTop < winInnerHeight + 1000) {
            enableNextPage = false
            console.log("clicking next page");
            eleNext.click()
        }
    })
}

// prevent refresh from pagination, ref: https://stackoverflow.com/a/58407610/9422455
function eventPagination(e: MouseEvent, url: string) {
    console.log("clicked!");

    e.preventDefault()

    //  use ajax
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = async function (v) {
        // Process the server response here.

        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            // Everything is good, the response was received.
            if (httpRequest.status === 200) {
                // Perfect!
                // 豆瓣的返回结果是以text而不是xml格式，所以我们还要继续解析
                // console.log("response type: ", httpRequest.responseType)
                console.log("responseText: ", httpRequest.responseText)
                // console.log("xml: ", httpRequest.responseXML);

                const eleNewHtml = document.createElement("html")
                eleNewHtml.innerHTML = this.responseText

                const s = await handleDiscussions(eleNewHtml)
                eleTbody.insertAdjacentHTML("beforeend", s)
                console.log("updated new page finished");
                enableNextPage = true

            } else {
                // There was a problem with the request.
                // For example, the response may have a 404 (Not Found)
                // or 500 (Internal Server Error) response code.
            }
        } else {
            // Not ready yet.
        }

    };
    httpRequest.open('GET', url, true/*async*/);
    httpRequest.send();

}