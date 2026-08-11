import React, { useEffect, useState } from 'react';
import type { IHostAPI } from '@shared/plugin-base';

interface PluginContainerProps {
  pluginId: string;
  manifest?: any;
  hostAPI?: IHostAPI;
}

export default function PluginContainer({ pluginId, manifest, hostAPI }: PluginContainerProps) {
  const [PluginComponent, setPluginComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostAPI) {
      setLoading(false);
      return;
    }

    const isReady = !!manifest?.ready;
    if (!isReady) {
      setLoading(false);
      return;
    }

    // Load plugin component dynamically
    (async () => {
      try {
        setLoading(true);
        // Path from dist/renderer/assets/*.js to dist/plugins/com.hakiwork/image-processor/src/index.js
        // dist/renderer/assets/xxx.js -> dist/ (2 levels up) -> plugins/ (1 level down)
        // So from renderer asset: ../../../plugins/com.hakiwork/image-processor/src/index.js
        const pluginPath = `../../../plugins/${manifest.package}/${pluginId}/src/index.js`;
        console.log('[PluginContainer] Trying to load:', pluginPath);

        const mod = await import(/* @vite-ignore */ pluginPath);
        const PluginClass = mod.default || mod[Object.keys(mod)[0]];
        if (!PluginClass) {
          setError('No plugin class found');
          return;
        }
        const instance = new PluginClass(manifest);
        await instance.initialize();
        const Comp = instance.getRenderComponent();
        if (Comp) {
          setPluginComponent(() => Comp);
        } else {
          setError('Plugin has no render component');
        }
      } catch (err: any) {
        console.error('[PluginContainer] Failed to load plugin:', err);
        setError(err.message || 'Failed to load plugin');
      } finally {
        setLoading(false);
      }
    })();
  }, [hostAPI, pluginId, manifest]);

  if (loading) {
    return (
      <div className="haki-loading">
        <img src={new URL('../assets/haki-loading.svg', import.meta.url).href} alt="loading" className="haki-loading-icon" />
        <div className="haki-loading-text">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="haki-empty">
        <img src={new URL('../assets/haki-empty.svg', import.meta.url).href} alt="empty" className="haki-empty-icon" />
        <div className="haki-empty-title">{manifest?.name || pluginId}</div>
        <div className="haki-empty-text">加载失败：{error}</div>
      </div>
    );
  }

  const displayName = manifest?.name || pluginId;
  const isReady = !!manifest?.ready;

  if (!isReady) {
    return (
      <div className="haki-empty">
        <img src={new URL('../assets/haki-empty.svg', import.meta.url).href} alt="empty" className="haki-empty-icon" />
        <div className="haki-empty-title">{displayName}</div>
        <div className="haki-empty-text">功能开发中，敬请期待</div>
      </div>
    );
  }

  if (PluginComponent) {
    return <PluginComponent hostAPI={hostAPI} pluginId={pluginId} />;
  }

  return (
    <div className="haki-card">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{displayName}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>功能开发中</div>
    </div>
  );
}