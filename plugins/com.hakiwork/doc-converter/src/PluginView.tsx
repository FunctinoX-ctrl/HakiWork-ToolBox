// doc-converter - UI Component
import React from 'react'
import type { PluginRenderProps } from '@shared/plugin-base'

export default function PluginView({ hostAPI, pluginId }: PluginRenderProps) {
  return (
    <div style={{ padding: 24, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
        doc-converter
      </div>
      <div style={{ color: '#656d76', fontSize: 13, marginBottom: 24 }}>
        [V1 placeholder]
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>文件导入</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="haki-btn">选择文件</button>
          <button className="haki-btn">选择文件夹</button>
          <button className="haki-btn">清空列表</button>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>参数配置</div>
        <div style={{ fontSize: 12, color: '#8b949e' }}>[V1 placeholder]</div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>任务进度</div>
        <div style={{ fontSize: 12, color: '#8b949e' }}>暂无任务</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="haki-btn">打开输出目录</button>
        <button className="haki-btn">重试失败项</button>
        <button className="haki-btn">导出日志</button>
      </div>
    </div>
  )
}