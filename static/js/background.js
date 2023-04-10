chrome.storage.local.get(['baseConfig'], function(result) {
    if (Object.keys(result).length === 0) {
        fetch(chrome.runtime.getURL('/conf/base.json'))
            .then(response => response.json())
            .then(data => {
                chrome.storage.local.set({ 'baseConfig': JSON.stringify(data) });
            })
            .catch(error => console.error(error));
    }
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendReponse) {
//     if(request.text) {
//         console.log("it is run");
//         let text = request.text;
//         fetch("/match_algorithm.py", {
//             method: POST,
//             body: text
//         })
//         .then(response => response.text())
//         .then(matchResult => {
//             sendReponse({result: matchResult});
//         });
//     }
// });



// 加载 GM_xmlhttpRequest 功能
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === 'GM_xmlhttpRequest') {
      const xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          sendResponse({responseText: xhr.responseText, status: xhr.status});
        }
      };
      xhr.send();
      return true; // 保持消息通道打开以供异步回应
    }
  });