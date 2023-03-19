export interface GM_xmlhttpRequestData {
	method: 'GET' | 'POST' | 'HEAD'
	url: string
	headers?: object
	onload?: (response: XMLHttpRequest) => any
	timeout?: number
	synchronous?: boolean
	user?: string
	password?: string
	data?: string // post data
	context?: object
	binary?: boolean
	upload?: {
		onabort?: Function
		onerror?: Function
		onload?: Function
		onprogress?: Function
	}
	overrideMimeType?: string
}

console.log('hello')

export declare function GM_xmlhttpRequest(data: GM_xmlhttpRequestData): void;

async function main() {
	
	// 必须加上`igu`参数，ref: https://stackoverflow.com/a/51746079/9422455
	// const url = "https://www.sogou.com"
	// const url = "https://mp.weixin.qq.com/"
	const url = 'https://www.thss.tsinghua.edu.cn/'
	// const url = "https://www.google.com/search?q=你好"
	console.log('start FM_xmlhttpRequest to url: ', url)
	GM_xmlhttpRequest({
		method: 'GET',
		url,
		onload: function (response) {
			const s: string = response.responseText
			console.log('response text: ', s)
			// console.log("response xml: ", response.responseXML);
			
			// solution 1. partially useful
			document.querySelector('html').innerHTML = response.responseText
			
			// solution 2. not useful
			// document.open('text/html')
			// document.write(s)
			// document.close()
			
			// solution 3. partially wonderful, for sogou! ref: https://qr.ae/pvPbV5
			// document.body.parentElement.innerHTML = s
			
			// solution 4.
			document.querySelector('html').innerHTML = s
			
			console.log('new document: ', document.textContent)
			
		},
	})
	
	
	console.log('end')
}


showIFrames()

function showIFrames() {
	const urls = [
		'http://localhost:2333',
		'https://www.4func.chat',
		  'https://www.taobao.com',
		// "https://www.huaban.com",
		// "https://www.google.com/search?igu=1&q=你好",
		//   'https://www.meituan.com',
	]
	
	const eleSuperWin = document.createElement('div')
	eleSuperWin.id = 'mark-iframes'
	
	const eleMain = document.querySelector('body')
	eleMain.insertAdjacentElement('afterbegin', eleSuperWin)
	
	Object.assign(eleSuperWin.style, {
		position: 'fixed',
		right: '20px',
		bottom: '20px',
		zIndex: '9999',
		
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
		gap: '4px',
		
		background: 'cyan',
		padding: '2px',
	} as CSSStyleDeclaration)
	
	urls.forEach(url_ => {
		console.log('iframe to url: ', url_)
		
		const eleIframe = document.createElement('iframe')
		eleIframe.src = url_
		Object.assign(eleIframe.style, {
			width: '320px',
			height: '240px',
		} as CSSStyleDeclaration)
		eleSuperWin.insertAdjacentElement('beforeend', eleIframe)
	})
	
}


