import React from 'react'

interface TitleBarProps {
  title?: string
}

const IconMinimize = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <line x1="1.5" y1="5" x2="8.5" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const IconMaximize = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const IconClose = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export default function TitleBar({ title = 'HakiWork' }: TitleBarProps) {
  const handleMinimize = () => (window as any).hakiwork?.minimizeWindow()
  const handleMaximize = () => (window as any).hakiwork?.maximizeWindow()
  const handleClose = () => (window as any).hakiwork?.closeWindow()

  return (
    <div className="haki-titlebar" style={{ WebkitAppRegion: 'drag' as any }}>
      <div className="haki-titlebar-title">{title}</div>
      <div className="haki-titlebar-buttons">
        <button
          className="haki-titlebar-btn"
          onClick={handleMinimize}
          style={{ WebkitAppRegion: 'no-drag' as any }}
          title="最小化"
        >
          <IconMinimize />
        </button>
        <button
          className="haki-titlebar-btn"
          onClick={handleMaximize}
          style={{ WebkitAppRegion: 'no-drag' as any }}
          title="最大化"
        >
          <IconMaximize />
        </button>
        <button
          className="haki-titlebar-btn haki-titlebar-close"
          onClick={handleClose}
          style={{ WebkitAppRegion: 'no-drag' as any }}
          title="关闭"
        >
          <IconClose />
        </button>
      </div>
    </div>
  )
}