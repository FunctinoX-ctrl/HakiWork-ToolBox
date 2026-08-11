import React, { useEffect, useState } from 'react';
import type { IHostAPI } from '@shared/plugin-base';

interface PluginContainerProps {
  pluginId: string;
  manifest?: any;
}

export default function PluginContainer({ pluginId, manifest }: PluginContainerProps) {
  const [hostAPI, setHostAPI] = useState<IHostAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.hakiwork?.hostAPI) {
      setLoading(false);
      return;
    }
    setHostAPI(window.hakiwork.hostAPI as unknown as IHostAPI);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="haki-loading">
        <img src={new URL('../assets/haki-loading.svg', import.meta.url).href} alt="loading" className="haki-loading-icon" />
        <div className="haki-loading-text">加载中...</div>
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
        <div className="haki-empty-text">
          功能开发中，敬请期待
        </div>
      </div>
    );
  }

  // Actual plugin UI will be rendered here when ready
  return (
    <div className="haki-card">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{displayName}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>功能开发中</div>
    </div>
  );
}