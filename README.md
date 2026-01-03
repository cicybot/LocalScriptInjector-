# Local Script Injector (Chrome Extension)

这是一个高效的 Chrome 开发辅助插件，允许开发者将本地的 JavaScript 文件实时注入到任何网页中。它支持页面加载时自动注入以及通过快捷键进行“热重载”。

## 🚨 关键更新 (CORS Fix)
为了解决 CORS 跨域限制，本插件现在通过 Background Service Worker 代理请求。
默认端口已更新为 **8282**。

请确保你的本地服务器地址为：
`http://127.0.0.1:8282/inject.js`

## ✨ 功能
*   **自动注入**: 打开网页时自动从本地服务器获取 JS 并执行。
*   **热重载**: 按下 `Cmd+I` (Mac) 或 `Ctrl+I` (Win) 立即重新加载本地代码，或使用**右键菜单**。
*   **CORS 穿透**: 即使本地服务器没有配置 CORS 头，插件也能正常工作。
*   **No Build**: 纯原生 JS 开发，无需编译。

## 📖 使用方法

### 1. 启动本地服务器
确保 `inject.js` 可通过 `http://127.0.0.1:8282/inject.js` 访问。
```bash
npm run server
```

### 2. 加载插件
1.  打开 Chrome 浏览器。
2.  进入 `chrome://extensions/`。
3.  开启右上角的 **开发者模式**。
4.  点击 **加载已解压的扩展程序**。
5.  **选择项目根目录** (包含 manifest.json 的文件夹)。

### 3. 开发
1.  修改本地的 `inject.js` 文件。
2.  在目标网页按下快捷键 (`Cmd+I` / `Ctrl+I`)，或者**右键点击页面 -> Reload Local Script**。
3.  观察控制台输出。
