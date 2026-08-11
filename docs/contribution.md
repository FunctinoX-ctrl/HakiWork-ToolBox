# 贡献指南

## 开发环境要求

- Node.js >= 18
- npm >= 9
- TypeScript >= 5

## 本地开发

```bash
# 安装依赖
npm install

# 构建并启动
npm test

# 仅构建（不启动）
npm run test:build
```

## 代码规范

- 使用 TypeScript，开启 `strict` 模式
- 提交前确保 `npm run test:build` 通过
- 遵循项目现有代码风格（见 `.editorconfig` 或 IDE 配置）
- 中文注释，变量命名使用英文

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新增批量图片水印功能
fix: 修复 PDF 旋转后文件损坏
docs: 更新插件开发文档
chore: 清理临时文件
```

类型说明：
- `feat` — 新功能
- `fix` — Bug 修复
- `docs` — 文档变更
- `style` — 代码格式（不影响功能）
- `refactor` — 重构
- `chore` — 构建/工具/依赖变更

## 插件开发

每个插件独立放在 `plugins/<name>/` 目录：
- `manifest.json` — 插件元数据
- `src/index.ts` — 插件入口（继承 `BasePlugin`）
- `src/PluginView.tsx` — 插件 UI 组件

详细指南见 [docs/plugin-development.md](./plugin-development.md)

## Pull Request 流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交变更：`git commit -m "feat: your description"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request，填写说明