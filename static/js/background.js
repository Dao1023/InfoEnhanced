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