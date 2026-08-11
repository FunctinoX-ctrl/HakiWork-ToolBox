# 插件开发指南

## 快速创建新插件

```bash
# 在 plugins/ 下创建插件目录
mkdir plugins/my-tool
cd plugins/my-tool
```

### 1. 创建 manifest.json

```json
{
  "version": "1.0.0",
  "name": "my-tool",
  "description": "插件功能描述",
  "author": "YourName",
  "category": "file",
  "main": "src/index.ts",
  "ready": false
}
```

`category` 可选值：`file` / `image` / `pdf` / `table`

`ready` 默认为 `false`，开发完成后设为 `true` 即可启用显示。

### 2. 创建插件入口 src/index.ts

```typescript
import { BasePlugin } from '@shared/plugin-base'
import type { PluginManifest } from '@shared/types'
import PluginView from './PluginView'

export default class MyToolPlugin extends BasePlugin {
  constructor(manifest: PluginManifest) {
    super(manifest)
  }

  protected async onMount(): Promise<void> {
    const api = this.getHostAPI()
    // 初始化逻辑
  }

  protected async onUnmount(): Promise<void> {
    // 清理逻辑
  }

  getRenderComponent() {
    return PluginView
  }
}
```

### 3. 创建 UI 组件 src/PluginView.tsx

```typescript
import React from 'react'
import type { PluginRenderProps } from '@shared/plugin-base'

export default function PluginView({ hostAPI, pluginId }: PluginRenderProps) {
  return (
    <div>
      <h2>{pluginId}</h2>
      {/* 你的插件 UI */}
    </div>
  )
}
```

### 4. 编译并启用

```bash
# 构建（会自动编译插件 TS 并复制 manifest）
npm run test:build

# 在 manifest.json 中设置 "ready": true
```

## HostAPI 可用方法

| 方法 | 说明 |
|------|------|
| `hostAPI.fileDialog(options)` | 打开文件选择对话框 |
| `hostAPI.saveDialog(options)` | 打开保存对话框 |
| `hostAPI.openExternal(url)` | 打开外部链接 |
| `hostAPI.openPath(path)` | 打开本地文件/文件夹 |
| `hostAPI.showNotification(options)` | 显示系统通知 |
| `hostAPI.getAppDataPath()` | 获取应用数据目录 |

## UI 组件规范

插件 UI 遵循项目统一四分区布局：

1. **文件导入区** — 选择文件 / 选择文件夹 / 清空列表
2. **参数配置区** — 当前插件所有可配置项
3. **任务进度区** — 进度条、状态、成功/失败数量
4. **结果操作区** — 打开目录、重试失败项、导出日志

CSS 类名：`haki-card`、`haki-btn`、`haki-btn-primary`、`haki-empty`、`haki-loading`

## 设计 Token

项目使用 CSS 变量统一管理样式：

```css
--color-primary: #7FBFBF    /* 主色：低饱和薄荷青 */
--color-bg: #FAFAF8         /* 底色 */
--color-sidebar-bg: #F7FAFC
--radius-md: 8px
--sidebar-width: 240px
```

详见 [src/renderer/src/index.css](../src/renderer/src/index.css)