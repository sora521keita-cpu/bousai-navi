import { useState } from 'react';
import { BottomTabs } from './components/BottomTabs';
import { EmergencyTab } from './components/EmergencyTab';
import { Header } from './components/Header';
import { LibraryTab } from './components/LibraryTab';
import { OfflineNotice } from './components/OfflineNotice';
import { RegionMapTab } from './components/RegionMapTab';
import type { TabId } from './types';

const tabLabels: Record<TabId, string> = {
  region: '地域マップ',
  library: '防災ライブラリ',
  emergency: '緊急',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('region');

  return (
    <div className="app-shell">
      <OfflineNotice />
      <Header onEmergencyClick={() => setActiveTab('emergency')} />
      <main className="app-main" aria-labelledby="page-title">
        <h2 id="page-title" className="visually-hidden">
          {tabLabels[activeTab]}
        </h2>
        {activeTab === 'region' && <RegionMapTab onEmergencyClick={() => setActiveTab('emergency')} />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'emergency' && <EmergencyTab />}
      </main>
      <button className="floating-emergency" type="button" onClick={() => setActiveTab('emergency')}>
        緊急
      </button>
      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
