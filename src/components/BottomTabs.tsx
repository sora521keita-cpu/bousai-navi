import type { TabId } from '../types';

type BottomTabsProps = {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
};

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'region', label: '地域マップ', icon: '🗾' },
  { id: 'library', label: '防災ライブラリ', icon: '📚' },
  { id: 'emergency', label: '緊急', icon: '🚨' },
];

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <nav className="bottom-tabs" aria-label="主要タブ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'tab-button active' : 'tab-button'}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onTabChange(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
