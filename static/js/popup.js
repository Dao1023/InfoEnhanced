$(function () {
    const adFilteringButton = document.getElementById("adFiltering");
    let box = document.getElementsByClassName("box")[0];
    let bar = document.getElementsByClassName("bar")[0];
    let all = document.getElementsByClassName("all")[0];
    let p = document.getElementById("text-strength");
    let cha = bar.offsetWidth - box.offsetWidth;

    // 用chrome.storage来读取adFilteringState
    chrome.storage.local.get(["adFilteringState", "filterStrength"], function (data) {
        let adFilteringState = data.adFilteringState;
        let filterStrength = data.filterStrength;

        if (adFilteringState === undefined) {
            adFilteringButton.innerHTML = "Open";
            chrome.storage.local.set({ adFilteringState: "off" });
        }

        if (adFilteringState === "on") {
            adFilteringButton.innerHTML = "Close";
            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { todo: "removeAd" });
                }
            );
        }

        adFilteringButton.addEventListener("click", function () {
            if (adFilteringButton.innerHTML === "Open") {
                adFilteringButton.innerHTML = "Close";
                chrome.storage.local.set({ adFilteringState: "on" });
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            todo: "removeAd",
                        });
                    }
                );
            } else {
                adFilteringButton.innerHTML = "Open";
                chrome.storage.local.set({ adFilteringState: "off" });
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { todo: "showAd" });
                    }
                );
            }
            console.log("has changed\n");
        });

        if (filterStrength === undefined) {
            chrome.storage.local.set({filterStrength: 0});
        } else {
            box.style.left = (filterStrength / 100 * cha) + "px";
            p.innerHTML = "过滤强度" + filterStrength + "%";
        }

        box.onmousedown = function (ev) {
            let boxL = box.offsetLeft;
            let e = ev || window.event; //兼容性
            let mouseX = e.clientX; //鼠标按下的位置
            window.onmousemove = function (ev) {
                let e = ev || window.event;
                let moveL = e.clientX - mouseX; //鼠标移动的距离
                let newL = boxL + moveL; //left值
                // 判断最大值和最小值
                if (newL < 0) {
                    newL = 0;
                }
                if (newL >= cha) {
                    newL = cha;
                }
                // 改变left值
                box.style.left = newL + "px";
                // 计算比例
                let bili = (newL / cha) * 100;
                p.innerHTML = "过滤强度" + Math.ceil(bili) + "%";
                let oldFilterStrength = filterStrength;
                chrome.storage.local.set({filterStrength: Math.ceil(bili)});
                filterStrength = Math.ceil(bili);
                if(adFilteringState === "on") {
                    if (oldFilterStrength <= filterStrength) {
                        chrome.tabs.query(
                            { active: true, currentWindow: true },
                            function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, { todo: "removeAd" });
                            }
                        );
                    } else {
                        chrome.tabs.query(
                            { active: true, currentWindow: true },
                            function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, { todo: "showAd" });
                            }
                        );

                        chrome.tabs.query(
                            { active: true, currentWindow: true },
                            function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, { todo: "removeAd" });
                            }
                        );
                    }
                }
                return false; // 取消默认事件
            };
            window.onmouseup = function () {
                window.onmousemove = false; // 解绑移动事件
                return false;
            };
            return false;
        };
    
        bar.onclick = function (ev) {
            let left = ev.clientX - all.offsetLeft - box.offsetWidth / 2;
            if (left < 0) {
                left = 0;
            }
            if (left >= cha) {
                left = cha;
            }
            box.style.left = left + "px";
            let bili = (left / cha) * 100;
            p.innerHTML = "过滤强度" + Math.ceil(bili) + "%";
            let oldFilterStrength = filterStrength;
            chrome.storage.local.set({filterStrength: Math.ceil(bili)});
            filterStrength = Math.ceil(bili);
            // console.log(left);
            if (adFilteringState === "on") {
                if (oldFilterStrength <= filterStrength) {
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, { todo: "removeAd" });
                        }
                    );
                } else {
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, { todo: "showAd" });
                        }
                    );

                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, { todo: "removeAd" });
                        }
                    );
                }
            }
            return false;
        };
    });
});
