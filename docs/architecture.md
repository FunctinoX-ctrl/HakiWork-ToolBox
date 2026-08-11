# HakiWork 架构说明

## 整体架构

HakiWork 采用 **Electron + React + TypeScript** 架构，主程序作为插件宿主框架，所有功能工具均为独立插件，完全解耦主程序，通过统一标准化的 HostAPI 通信。

## 目录结构

```
src/
  main/           # 主进程
    index.ts      # 入口：创建窗口、注册 IPC、初始化插件管理器
    plugin-manager.ts  # 插件管理器：扫描、加载、卸载插件
    preload.ts    # 预加载：通过 contextBridge 暴露 HostAPI 到渲染进程
    host-api/     # 宿主 API 实现
      index.ts    # 统一入口
      file-dialog.ts
      notification.ts
      shell.ts
  renderer/       # 渲染进程（React）
    src/
      main.tsx    # React 入口
      App.tsx     # 应用根组件
      index.css   # 全局样式（设计 Token + 组件样式）
      components/ # UI 组件
        Layout.tsx
        Sidebar.tsx
        TitleBar.tsx
        WelcomePage.tsx
      plugins/    # 插件容器
        PluginContainer.tsx
  shared/         # 共享层
    types.ts      # 公共类型定义
    host-api-types.ts  # HostAPI 接口与 IPC 频道常量
    plugin-base.ts    # BasePlugin 基类
plugins/          # 官方插件（每个插件独立目录）
  doc-converter/
  image-processor/
  file-organizer/
  pdf-tool/
  table-tool/
docs/             # 项目文档
.github/          # GitHub 配置（Issue 模板、CI）
```

## 通信机制

| 通信方向 | 机制 | 说明 |
|---------|------|------|
| 主进程 ↔ 渲染进程 | IPC (`ipcMain` / `ipcRenderer`) | 通过 `contextBridge` 安全暴露 |
| 渲染进程 → 宿主能力 | HostAPI | 通过 `window.hakiwork` 调用文件选择、通知、路径等操作 |
| 主进程 → 插件 | 直接调用 | PluginManager 持有插件实例，直接调用其方法 |
| 插件 → 渲染进程 | IPC 事件 | 插件通过 `PLUGIN_MESSAGE` 发送消息，渲染进程订阅响应 |

## 插件生命周期

1. **启动扫描** — `PluginManager.scanAndLoadPlugins()` 遍历 `dist/plugins/` 目录
2. **读取 Manifest** — 解析每个插件目录下的 `manifest.json`
3. **校验字段** — 检查 `name`、`version`、`description`、`main`、`category` 必填
4. **加载模块** — 通过 `import(entryPath)` 动态加载插件 JS 入口
5. **创建实例** — `new PluginClass(manifest)` 并调用 `instance.initialize()`
6. **推送列表** — 主进程通过 `PLUGIN_LIST_UPDATED` 事件将插件列表推给渲染进程
7. **渲染挂载** — 渲染进程通过 `PluginContainer` 动态加载并渲染插件 React 组件

## HostAPI

HostAPI 是渲染进程调用主进程能力的唯一通道，通过 `contextBridge` 暴露：

```typescript
// 渲染进程中调用
window.hakiwork.hostAPI.fileDialog({ title: '选择文件', properties: ['openFile'] })
window.hakiwork.hostAPI.showNotification({ title: '提示', body: '操作完成' })
window.hakiwork.minimizeWindow()
window.hakiwork.maximizeWindow()
window.hakiwork.closeWindow()
```

## 插件开发要点

- 插件目录放在 `plugins/<name>/`
- `manifest.json` 中 `main` 字段指向 `src/index.ts`（构建后自动编译为 `.js`）
- 插件 UI 通过 `getRenderComponent()` 返回 React 组件
- 插件能力通过 `this.getHostAPI()` 获取宿主 API