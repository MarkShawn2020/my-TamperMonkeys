// global augmentation, ref: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation, https://stackoverflow.com/a/53566553/9422455
declare global {
    interface NodeList {
        map(callbackfn: (value: Node) => any): any[]
    }

    interface NodeListOf<TNode extends Node> {
        map(callbackfn: (value: Node) => any): any[]
    }
}

// 【！！！！！！！】这里不能用箭头函数，否则无法捕捉this【！！！！！！】
NodeList.prototype.map = function (fn: (value: Node) => any) {
    let ans: any[] = [];

    this.forEach((value: Node) => {
        ans.push(fn(value))
    })

    return ans;
}


// wait element to exist, ref: https://stackoverflow.com/a/61511955/9422455
export function wait<E extends Element>(selector: string, fromSelector: HTMLElement | Document = document): Promise<E> {

    return new Promise(resolve => {
        const ele = fromSelector.querySelector(selector) as E;
        if (ele !== null) return resolve(ele);

        const observer = new MutationObserver(mutations => {
            const ele = fromSelector.querySelector(selector) as E;
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


export function waitAll<E extends Element = Element>(selector: string, minCount: number = 1, fromSelector: HTMLElement | Document = document): Promise<NodeListOf<E>> {
    return new Promise(resolve => {
        // console.log("preparing to find `" + selector + "`");
        let eles = fromSelector.querySelectorAll(selector) as NodeListOf<E>;
        if (eles.length > minCount) {
            console.log("found " + eles.length + " elements WITHOUT observer");
            return resolve(eles);
        }

        const observer = new MutationObserver(mutations => {
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


export const modifyStyle = (ele: HTMLElement, style: Pick<CSSStyleDeclaration, any>) => {
    Object.assign(ele.style, style)
}