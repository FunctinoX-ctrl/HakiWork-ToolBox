# 打工哈基米 HakiWork

离线轻量化插件化批量办公工具箱，解放双手，简化繁琐操作。

![License](https://img.shields.io/badge/license-Apache--2.0-blue)
![Electron](https://img.shields.io/badge/Electron-33-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## 特性

- **插件化架构** — 所有功能以独立插件形式存在，完全解耦，易于拓展
- **离线本地处理** — 无广告、不上云，文件全程本地处理
- **批量办公工具** — 文档转换、图片处理、文件整理、PDF 操作、表格处理
- **第三方开发者支持** — 标准化插件接口，可自主开发安装插件

## 技术栈

Electron + Node.js + TypeScript + React + Vite

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（需先启动 Vite dev server）
npx vite &           # 终端 1
node scripts/test.js # 终端 2

# 构建
npm run test:build

# 启动
npm test
```

## 目录结构

```
src/
  main/           # 主进程（Electron）
    index.ts      # 入口：创建窗口、IPC、插件管理器
    plugin-manager.ts  # 插件扫描、加载、卸载
    preload.ts    # contextBridge：暴露 HostAPI
    host-api/     # 宿主 API 实现
  renderer/       # 渲染进程（React）
    src/
      main.tsx    # React 入口
      App.tsx     # 应用根组件
      index.css   # 全局样式
      components/ # UI 组件（Sidebar、TitleBar、Layout 等）
      plugins/    # 插件容器
  shared/         # 共享类型与工具
plugins/          # 官方插件（每个插件独立目录）
docs/             # 项目文档
scripts/          # 构建与启动脚本
```

## 插件开发

每个插件是一个独立目录，包含：

| 文件 | 说明 |
|------|------|
| `manifest.json` | 插件元数据（名称、版本、分类、入口） |
| `src/index.ts` | 插件入口类，继承 `BasePlugin` |
| `src/PluginView.tsx` | 插件 UI 组件（React） |

**启用插件**：在 `manifest.json` 中添加 `"ready": true`

详细开发指南见 [docs/plugin-development.md](./docs/plugin-development.md)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交变更 (`git commit -m 'add: xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 提交 Pull Request

代码规范：
- 使用 TypeScript，开启 strict 模式
- 提交前确保 `npm run test:build` 通过
- 遵循项目现有代码风格

详见 [docs/contribution.md](./docs/contribution.md)

## 许可证

[Apache-2.0](./LICENSE)