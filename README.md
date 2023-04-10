# InfoEnhanced：网页优化插件

<img src="static\images\icon1.png" width = "30" alt="logo" align=center>
本插件主要用于提高网页信息质量。

目前功能包括

- 广告清理
  - 百度搜索
  - 知乎
  - CSDN
- 搜索引擎
  - 百度搜索结果重复清理
  - 搜索再排序（开发中）
- B站
  - 搜索页、推荐页营销号过滤（开发中）

欢迎各位用户在 Issues 提出更多的功能建议。

## 安装

安装流程

- 下载插件安装包，并解压缩。
- 打开 Chrome 浏览器，点击右上角的菜单按钮，选择“更多工具” -> “扩展程序”。
- 在扩展程序页面，打开“开发者模式”开关。
- 点击“加载已解压的扩展程序”按钮，并选择解压缩后的插件文件夹。

## 测试

我们在尝试将 Bilibili-evolved 加入我们的插件。

Bilibili-evovled 使用油猴脚本进行加载，我们需要重新使用 Chrome Extension API 进行重构。