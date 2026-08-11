import React from 'react'
import Sidebar from './Sidebar'
import TitleBar from './TitleBar'
import type { PluginEntry } from '@shared/plugin-base'

interface LayoutProps {
  plugins: PluginEntry[]
  activePluginId: string | null
  onSelectPlugin: (id: string) => void
  children: React.ReactNode
}

export default function Layout({ plugins, activePluginId, onSelectPlugin, children }: LayoutProps) {
  return (
    <div className="haki-layout">
      <TitleBar />
      <div className="haki-layout-body">
        <Sidebar
          plugins={plugins}
          activePluginId={activePluginId}
          onSelectPlugin={onSelectPlugin}
        />
        <main className="haki-content">
          <div className="haki-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}