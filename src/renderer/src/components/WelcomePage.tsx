import React from 'react';

interface WelcomePageProps {
  pluginCount: number;
}

export default function WelcomePage({ pluginCount }: WelcomePageProps) {
  return (
    <div className="haki-empty">
      <img src={new URL('../assets/haki-empty.svg', import.meta.url).href} alt="empty" className="haki-empty-icon" />
      <div className="haki-empty-title">
        {pluginCount === 0 ? '现在还没有任何插件' : '欢迎使用 HakiWork'}
      </div>
      <div className="haki-empty-text">
        {pluginCount === 0
          ? '插件正在开发中，敬请期待'
          : '离线轻量化插件化批量办公工具箱'}
      </div>
    </div>
  );
}