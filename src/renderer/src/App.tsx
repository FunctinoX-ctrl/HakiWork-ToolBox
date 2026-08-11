import React, { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout'
import WelcomePage from './components/WelcomePage'
import PluginContainer from './plugins/PluginContainer'
import type { PluginEntry } from '@shared/plugin-base'

export default function App() {
  const [plugins, setPlugins] = useState<PluginEntry[]>([])
  const [activePluginId, setActivePluginId] = useState<string | null>(null)

  useEffect(() => {
    if (!window.hakiwork) {
      console.warn('[App] hakiwork not available')
      return
    }
    window.hakiwork.onPluginListUpdated((pluginList: PluginEntry[]) => {
      console.log('[App] Plugin list received:', pluginList.map(p => p.id))
      setPlugins(pluginList)
      const readyPlugin = pluginList.find(p => p.manifest?.ready)
      if (readyPlugin && !activePluginId) {
        setActivePluginId(readyPlugin.id)
      }
    })
  }, [activePluginId])

  const handleSelectPlugin = useCallback((id: string) => {
    setActivePluginId(id || null)
  }, [])

  const readyPlugins = plugins.filter(p => p.manifest?.ready)

  return (
    <Layout
      plugins={plugins}
      activePluginId={activePluginId}
      onSelectPlugin={handleSelectPlugin}
    >
      {activePluginId ? (
        <PluginContainer
          pluginId={activePluginId}
          manifest={plugins.find(p => p.id === activePluginId)?.manifest}
        />
      ) : (
        <WelcomePage pluginCount={readyPlugins.length} />
      )}
    </Layout>
  )
}