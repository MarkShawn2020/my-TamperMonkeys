"use strict";
exports.__esModule = true;
exports.waitAll = exports.wait = void 0;
// 【！！！！！！！】这里不能用箭头函数，否则无法捕捉this【！！！！！！】
NodeList.prototype.map = function (fn) {
    var ans = [];
    this.forEach(function (value) {
        ans.push(fn(value));
    });
    return ans;
};
// wait element to exist, ref: https://stackoverflow.com/a/61511955/9422455
function wait(selector, fromSelector) {
    if (fromSelector === void 0) { fromSelector = document; }
    return new Promise(function (resolve) {
        var ele = fromSelector.querySelector(selector);
        if (ele !== null)
            return resolve(ele);
        var observer = new MutationObserver(function (mutations) {
            var ele = fromSelector.querySelector(selector);
            if (ele !== null) {
                resolve(ele);
                observer.disconnect();
            }
        });
        observer.observe(fromSelector === document ? document.body : fromSelector, {
            childList: true,
            subtree: true
        });
    });
}
exports.wait = wait;
function waitAll(selector, minCount, fromSelector) {
    if (minCount === void 0) { minCount = 1; }
    if (fromSelector === void 0) { fromSelector = document; }
    return new Promise(function (resolve) {
        // console.log("preparing to find `" + selector + "`");
        var eles = fromSelector.querySelectorAll(selector);
        if (eles.length > minCount) {
            console.log("found " + eles.length + " elements WITHOUT observer");
            return resolve(eles);
        }
        var observer = new MutationObserver(function (mutations) {
            eles = fromSelector.querySelectorAll(selector);
            if (eles.length >= minCount) {
                console.log("found " + eles.length + " elements WITH observer");
                resolve(eles);
                observer.disconnect();
            }
        });
        observer.observe(fromSelector === document ? document.body : fromSelector, {
            childList: true,
            subtree: true
        });
    });
}
exports.waitAll = waitAll;
