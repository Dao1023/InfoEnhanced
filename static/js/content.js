// import {cut} from "/static/package/jieba/main.js";

$(function () {
    function editDistance(text_1, text_2, minValue) {
        // console.log(minValue);
        const N = text_1.length + 1,
            M = text_2.length + 1,
            INF = 0x3f3f3f3f;
        text_1 = "0" + text_1;
        text_2 = "0" + text_2;
        // console.log(text_1);
        // console.log(text_2);
        let dp = [];
        for (let i = 0; i <= N; i++) {
            dp[i] = [];
            for (let j = 0; j <= M; j++) {
                dp[i][j] = 0;
            }
        }
        for (let i = 0; i <= N; i++) {
            dp[i][0] = i;
        }
        for (let i = 0; i <= M; i++) {
            dp[0][i] = i;
        }

        for (let i = 1; i <= N; i++) {
            for (let j = 1; j <= M; j++) {
                if (text_1[i] == text_2[j]) dp[i][j] = dp[i - 1][j - 1];
                else {
                    a = dp[i - 1][j] + 1;
                    b = dp[i][j - 1] + 1;
                    c = dp[i - 1][j - 1] + 1;
                    dp[i][j] = Math.min(Math.min(a, b), c);
                }
            }
        }
        let minDistance = dp[N][M];
        let similarity = 1 - minDistance / Math.max(N, M);

        if (similarity >= 1 - minValue / 100) return true;
        return false;
    }

    // function cosineSimilarity() {
    //     const text = "这是一个测试句子";
    //     console.log(nodejieba.cut(text));
    // }

    
    $('body').append('<script data-main="/static/package/jieba/main" src="/static/package/jieba/require.js"></script>');
    
    // _text = "這個布丁是在無聊的世界中找尋樂趣的一種不能吃的食物，喜愛動漫畫、遊戲、程式，以及跟世間脫節的生活步調。";
    // console.log(cut(_text));

    function removeAd(website) {
        let webName = website.split(".")[1];
        console.log(webName);
        chrome.storage.local.get(
            ["baseConfig", "filterStrength"],
            function (data) {
                const minSimilarityValue = data.filterStrength;
                let datas = JSON.parse(data.baseConfig);
                for (let web in datas) {
                    if (web === webName) {
                        let comps = datas[web];
                        for (let comp in comps) {
                            let tags = comps[comp];
                            for (let tag in tags) {
                                for (let item of tags[tag]) {
                                    let alls;
                                    if (tag === "className") {
                                        alls =
                                            document.getElementsByClassName(
                                                item
                                            );
                                    } else if (tag === "id") {
                                        alls = document.getElementById(item);
                                    }
                                    if (alls) {
                                        for (let i = 0; i < alls.length; i++) {
                                            alls[i].style.display = "none";
                                            console.log("已移除");
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
                console.log("removeAd");
                let searchResults = document.querySelectorAll(".result");
                let titles = [],
                    descriptions = [];
                for (let i = 0; i < searchResults.length; i++) {
                    titles.push(searchResults[i].querySelector(".t"));
                    descriptions.push(
                        searchResults[i].querySelector(".content-right_8Zs40")
                    );
                    // console.log(titles[i].con);
                }
                // 遍历每个搜索结果
                let similerState = [searchResults.length];
                similerState.fill(0);
                // console.log(minSimilarityValue);
                for (let i = 0; i < searchResults.length; i++) {
                    if (similerState[i] === 1) continue;
                    for (let j = i + 1; j < searchResults.length; j++) {
                        if (
                            editDistance(
                                titles[i].textContent,
                                titles[j].textContent,
                                minSimilarityValue
                            ) ||
                            editDistance(
                                descriptions[i].textContent,
                                descriptions[j].textContent,
                                minSimilarityValue
                            )
                        ) {
                            similerState = 1;
                            searchResults[j].style.display = "none";
                            console.log("similarity is too high!");
                        }
                    }
                }
            }
        );
    }

    function showAd(website) {
        let webName = website.split(".")[1];
        chrome.storage.local.get("baseConfig", function (data) {
            let datas = JSON.parse(data.baseConfig);
            for (let web in datas) {
                if (web === webName) {
                    let comps = datas[web];
                    for (let comp in comps) {
                        let tags = comps[comp];
                        for (let tag in tags) {
                            for (let item of tags[tag]) {
                                let alls;
                                if (tag === "className") {
                                    alls =
                                        document.getElementsByClassName(item);
                                } else if (tag === "id") {
                                    alls = document.getElementById(item);
                                }
                                if (alls) {
                                    for (let i = 0; i < alls.length; i++) {
                                        alls[i].style.display = "block";
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
            console.log("showAd");
            let searchResults = document.querySelectorAll(".result");
            // 遍历每个搜索结果
            for (let i = 0; i < searchResults.length; i++) {
                // 找到每个结果的标题和描述
                // let title = searchResults[i].querySelector(".t");
                // let description = searchResults[i].querySelector(
                //     ".content-right_8Zs40"
                // );
                // 在控制台中打印标题和描述
                // console.log(title.textContent);
                // console.log(description.textContent);
                searchResults[i].style.display = "block";
            }
        });
    }

    // 在页面加载时读取之前保存的状态
    chrome.storage.local.get("adFilteringState", function (data) {
        if (data.adFilteringState === "on") {
            let website = window.location.host;
            removeAd(website);
        }
    });

    // chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
    //     // 检查当前页面是否已经加载完成
    //     if (changeInfo.status == 'complete') {
    //       // 执行过滤操作
    //         console.log("---------");
    //         let website = window.location.host;
    //         removeAd(website);
    //         chrome.storage.local.set({ adFilteringState: "on" });
    //     }
    // });

    chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendReponse
    ) {
        if (request.todo == "removeAd") {
            let website = window.location.host;
            removeAd(website);
            chrome.storage.local.set({ adFilteringState: "on" });
        } else if (request.todo == "showAd") {
            let website = window.location.host;
            showAd(website);
            chrome.storage.local.set({ adFilteringState: "off" });
        }
    });

    // cosineSimilarity();


});
