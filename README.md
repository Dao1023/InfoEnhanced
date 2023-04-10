# InfoEvolved：网页优化插件

本插件主要用于提高网页信息质量。

目前功能包括

- 常见广告清理
- 百度搜索结果重复清理
- B站营销号过滤（包括搜索页、推荐页）

更多功能陆续开发中

## 安装

安装流程

- 下载插件安装包，并解压缩。
- 打开 Chrome 浏览器，点击右上角的菜单按钮，选择“更多工具” -> “扩展程序”。
- 在扩展程序页面，打开“开发者模式”开关。
- 点击“加载已解压的扩展程序”按钮，并选择解压缩后的插件文件夹。

## 测试

我们在尝试将 Bilibili-evolved 加入我们的插件。

Bilibili-evovled 使用油猴脚本进行加载，我们需要重新使用 Chrome Extension API 进行重构。

使用的函数包括

- `GM_getValue`：使用 `chrome.storage.sync` 进行替换
- `GM_setValue `：使用 `chrome.storage.sync` 进行替换
- `GM_deleteValue`：
- `GM_info`：
- `GM_xmlhttpRequest`：

你好！根据你提供的油猴脚本，我将为你提供一个简单的 Chrome Extension 实现。油猴脚本中涉及的功能如下：

1. unsafeWindow
2. GM_getValue
3. GM_setValue
4. GM_deleteValue
5. GM_info
6. GM_xmlhttpRequest

我们将逐个替换这些功能。首先，创建一个名为`manifest.json`的文件，内容如下：

```json
{
  "manifest_version": 2,
  "name": "My Chrome Extension",
  "version": "1.0",
  "description": "A simple Chrome Extension",
  "permissions": [
    "storage",
    "tabs",
    "webRequest",
    "webRequestBlocking",
    "<all_urls>"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

接下来，创建`background.js`文件：

```javascript
// background.js

// 监听来自 content script 的消息
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
```

最后，创建`content.js`文件：

```javascript
// content.js

// 1. unsafeWindow 直接使用 window 即可

// 2. GM_getValue
function GM_getValue(key, defaultValue) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key] !== undefined ? result[key] : defaultValue);
    });
  });
}

// 3. GM_setValue
function GM_setValue(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, resolve);
  });
}

// 4. GM_deleteValue
function GM_deleteValue(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove([key], resolve);
  });
}

// 5. GM_info
const GM_info = {
  script: {
    name: "My Chrome Extension",
    version: "1.0",
    description: "A simple Chrome Extension",
  },
};

// 6. GM_xmlhttpRequest
function GM_xmlhttpRequest({method, url}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({type: 'GM_xmlhttpRequest', method, url}, resolve);
  });
}
```

这样，我们就用 Chrome Extension 替换了油猴脚本中的功能。你可以根据自己的需求修改这些代码。