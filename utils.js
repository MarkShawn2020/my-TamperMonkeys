"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitAll = exports.wait = void 0;
// wait element to exist, ref: https://stackoverflow.com/a/61511955/9422455
function wait(selector) {
    return new Promise(resolve => {
        const ele = document.querySelector(selector);
        if (ele !== null)
            return resolve(ele);
        const observer = new MutationObserver(mutations => {
            const ele = document.querySelector(selector);
            if (ele !== null) {
                resolve(ele);
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
exports.wait = wait;
function waitAll(selector) {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length > 0) {
            return resolve(document.querySelectorAll(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector).length > 0) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
exports.waitAll = waitAll;
