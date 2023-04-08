$(() => {
    // 提示
    console.log("已加载过滤插件的 server.js");

    // 创建对象，对按键进行响应
    const adFilteringButton = document.getElementById("getServerData");
    adFilteringButton.addEventListener("click", () => {
        console.log("fetching...");

        // 头文件
        const fetchOptions = {
            method: "GET",
            mode: "cors",
            headers: {
                Origin: "http://localhost:3000/", // 设置请求头中的 Origin 字段
            },
        };

        // fetch 获取 get 请求
        fetch("http://localhost:3000/api", fetchOptions)
            // 请求成功后转换 Json 对象
            .then((res) => res.json())
            .then((data) => {
                // 获取 json 字符串
                // 创建 Blob 对象，用于保存数据
                // 创建 URL 对象，用于保存 Blob 的 url
                // 创建 <a> 标签，用于下载数据
                // 将 <a> 标签添加到文档，模拟点击，并下载，最后释放内存
                const json = JSON.stringify(data);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "/conf/base.json";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            })
            // 请求失败时返回错误
            .catch((err) => console.error(err));
        console.log("json success\n");
    });
});
