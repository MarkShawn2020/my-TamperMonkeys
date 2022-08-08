"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var client_1 = require("react-dom/client");
var CompTag_1 = require("../CompTag");
var utils_1 = require("../utils");
var KEY_DISCUSSIONS = "discussions";
var eleTbody = undefined;
var enableNextPage = true;
(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (window.location.href.includes("start=0")) {
                        GM_setValue(KEY_DISCUSSIONS, "");
                    }
                    // 1. 移除广告
                    removeAd();
                    // 2. 移动群公告（否则我们不能第一时间看到帖子列表）
                    moveGroupBoard();
                    // 3. 增加签名
                    addSlogan();
                    // 4. （主）筛选帖子
                    return [4 /*yield*/, initDiscussions()];
                case 1:
                    // 4. （主）筛选帖子
                    _a.sent();
                    return [4 /*yield*/, handleDiscussions()
                        // 5. 翻页，并循环4
                    ];
                case 2:
                    _a.sent();
                    // 5. 翻页，并循环4
                    return [4 /*yield*/, navigatePages()];
                case 3:
                    // 5. 翻页，并循环4
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})();
function removeAd() {
    return __awaiter(this, void 0, void 0, function () {
        var ads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.waitAll)("div[ad-status]")];
                case 1:
                    ads = _a.sent();
                    ads.forEach(function (ad) { return ad.remove(); });
                    return [2 /*return*/];
            }
        });
    });
}
function addSlogan() {
    return __awaiter(this, void 0, void 0, function () {
        var eleGroupDesc, eleMonkey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.wait)("#content h1")];
                case 1:
                    eleGroupDesc = _a.sent();
                    eleMonkey = document.createElement("span");
                    eleMonkey.innerText = "油猴无敌！";
                    Object.assign(eleMonkey.style, { color: "red", marginLeft: "10px", fontStyle: "italic" });
                    eleGroupDesc.insertAdjacentElement("beforeend", eleMonkey);
                    return [2 /*return*/];
            }
        });
    });
}
function moveGroupBoard() {
    return __awaiter(this, void 0, void 0, function () {
        var eleGroupBoard, eleSide;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.wait)(".group-board")];
                case 1:
                    eleGroupBoard = _a.sent();
                    return [4 /*yield*/, (0, utils_1.wait)(".aside")];
                case 2:
                    eleSide = _a.sent();
                    eleSide.querySelector(".mod").remove(); // 这个`.mod`是最近加入的人，但这个类与主内容类一样，所以必须链式选中删除
                    eleSide.insertAdjacentElement("beforeend", eleGroupBoard);
                    return [2 /*return*/];
            }
        });
    });
}
function initDiscussions() {
    return __awaiter(this, void 0, void 0, function () {
        var topic;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("filtering discussions");
                    return [4 /*yield*/, (0, utils_1.wait)("#group-topics tr, #content .article tbody")];
                case 1:
                    eleTbody = _a.sent();
                    return [4 /*yield*/, (0, utils_1.wait)("tr", eleTbody)]; // query or, ref: https://stackoverflow.com/a/34001943/9422455
                case 2:
                    topic = _a.sent() // query or, ref: https://stackoverflow.com/a/34001943/9422455
                    ;
                    topic.insertAdjacentHTML("afterbegin", '<td>状态标记</td>');
                    return [2 /*return*/];
            }
        });
    });
}
function handleDiscussionRow(topic) {
    var text = "", color = "#eee";
    var eleTitle = topic.querySelector("a[title]");
    var matchPrice = eleTitle.title.match(/\d{2}00/);
    if (matchPrice !== null) {
        // console.log({ matchPrice });
        var matchedPrice = parseInt(matchPrice[0]);
        if (2000 <= matchedPrice && matchedPrice <= 3000) {
            text = "WOW", color = "green";
        }
        else {
            color = "darkred";
            text = matchedPrice > 3000 ? "价格过高" : "价格过低";
            topic.querySelectorAll('td').forEach(function (td) { return td.style.textDecoration = "line-through"; });
        }
    }
    // 使用react的办法，不太适合后期修改结点，所以放在最后操纵结点
    var newDomElement = document.createElement('td');
    topic.insertAdjacentElement("afterbegin", newDomElement);
    (0, react_dom_1.flushSync)(function () {
        // 在react18里强制刷新，ref: https://stackoverflow.com/a/71983073/9422455
        client_1["default"].createRoot(newDomElement).render(<CompTag_1.CompTag text={text} color={color}/>);
    });
    return topic.outerHTML;
}
function handleDiscussions(fromSelector) {
    if (fromSelector === void 0) { fromSelector = document; }
    return __awaiter(this, void 0, void 0, function () {
        var discussions, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.waitAll)("#group-topics tr, #content .article tr:not(.th)", 20, fromSelector)];
                case 1:
                    discussions = _a.sent();
                    console.log("topics found: ", discussions.length);
                    s = discussions.map(handleDiscussionRow).join("\n");
                    console.log({ s: s });
                    return [2 /*return*/, s];
            }
        });
    });
}
function navigatePages() {
    return __awaiter(this, void 0, void 0, function () {
        var eleNext;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("enable page navigation");
                    return [4 /*yield*/, (0, utils_1.wait)(".paginator .next a")
                        // [FAILED] prevent refresh, ref: https://stackoverflow.com/a/13262305/9422455
                        // eleNext.setAttribute("type", "button")
                    ];
                case 1:
                    eleNext = _a.sent();
                    // [FAILED] prevent refresh, ref: https://stackoverflow.com/a/13262305/9422455
                    // eleNext.setAttribute("type", "button")
                    eleNext.onclick = function (e) { return eventPagination(e, eleNext.getAttribute("href")); };
                    // detect whether the next btn is going to be visible, ref: https://stackoverflow.com/a/7557433/9422455
                    // detect scroll, ref: https://stackoverflow.com/q/45191427/9422455
                    window.onscroll = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var eleNextTop, winInnerHeight, docClientHeight;
                        return __generator(this, function (_a) {
                            eleNextTop = eleNext.getBoundingClientRect().top;
                            winInnerHeight = window.innerHeight;
                            docClientHeight = document.documentElement.clientHeight;
                            console.log({ eleNextTop: eleNextTop, winInnerHeight: winInnerHeight, docClientHeight: docClientHeight });
                            if (enableNextPage && eleNextTop < winInnerHeight + 1000) {
                                enableNextPage = false;
                                console.log("clicking next page");
                                eleNext.click();
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
// prevent refresh from pagination, ref: https://stackoverflow.com/a/58407610/9422455
function eventPagination(e, url) {
    console.log("clicked!");
    e.preventDefault();
    //  use ajax
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            var eleNewHtml, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(httpRequest.readyState === XMLHttpRequest.DONE)) return [3 /*break*/, 3];
                        if (!(httpRequest.status === 200)) return [3 /*break*/, 2];
                        // Perfect!
                        // 豆瓣的返回结果是以text而不是xml格式，所以我们还要继续解析
                        // console.log("response type: ", httpRequest.responseType)
                        console.log("responseText: ", httpRequest.responseText);
                        eleNewHtml = document.createElement("html");
                        eleNewHtml.innerHTML = this.responseText;
                        return [4 /*yield*/, handleDiscussions(eleNewHtml)];
                    case 1:
                        s = _a.sent();
                        eleTbody.insertAdjacentHTML("beforeend", s);
                        console.log("updated new page finished");
                        enableNextPage = true;
                        return [3 /*break*/, 2];
                    case 2: return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    httpRequest.open('GET', url, true /*async*/);
    httpRequest.send();
}
