import React from 'react';
import type { PluginEntry } from '@shared/plugin-base';

interface SidebarProps {
  plugins: PluginEntry[];
  activePluginId: string | null;
  onSelectPlugin: (id: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: '首页', icon: 'icon-home' },
  { id: 'plugins', label: '插件', icon: 'icon-plugins' },
];

function iconUrl(name: string) {
  return new URL(`../assets/${name}.svg`, import.meta.url).href;
}

export default function Sidebar({ plugins, activePluginId, onSelectPlugin }: SidebarProps) {
  const readyPlugins = plugins.filter(p => p.manifest?.ready);

  const isActive = (id: string) => {
    if (id === 'home') return !activePluginId;
    if (id === 'plugins') return !!activePluginId;
    return false;
  };

  const handlePluginsClick = () => {
    if (readyPlugins.length > 0) {
      onSelectPlugin(readyPlugins[0].id);
    }
  };

  return (
    <aside className="haki-sidebar">
      <div className="haki-sidebar-logo">
        <img src={iconUrl('haki-logo')} alt="HakiWork" className="haki-logo-img" />
        <span className="haki-sidebar-logo-text">HakiWork</span>
      </div>

      <nav className="haki-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`haki-nav-item${isActive(item.id) ? ' haki-nav-item-active' : ''}`}
            onClick={
              item.id === 'home'
                ? () => onSelectPlugin('')
                : handlePluginsClick
            }
          >
            <img src={iconUrl(item.icon)} alt={item.label} className="haki-nav-icon" />
            {item.label}
            {item.id === 'plugins' && readyPlugins.length > 0 && (
              <span className="haki-badge">{readyPlugins.length}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="haki-sidebar-footer">
        <button className="haki-theme-toggle" title="切换主题">
          <img src={iconUrl('icon-moon')} alt="主题" className="haki-theme-icon" />
          切换主题
        </button>
        <button className="haki-theme-toggle" title="设置">
          <img src={iconUrl('icon-settings')} alt="设置" className="haki-theme-icon" />
          设置
        </button>
      </div>
    </aside>
  );
}