import { useState } from 'react';
import { emergencyActions } from '../data/emergencyActions';
import { EmergencyCard } from './EmergencyCard';

export function EmergencyTab() {
  const [openId, setOpenId] = useState<string>(emergencyActions[0]?.id ?? '');

  function openNextAction(actionId: string) {
    setOpenId(actionId);
    window.setTimeout(() => document.getElementById(`emergency-${actionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  return (
    <section className="tab-content emergency-tab">
      <div className="emergency-banner">
        <p className="eyebrow">Emergency</p>
        <h2>緊急時の行動</h2>
        <p>外部リンクより先に、アプリ内の短い手順を確認できます。通信不能時でも最低限の行動カードを読める設計です。</p>
      </div>
      <div className="card-stack">
        {emergencyActions.map((action) => (
          <div id={`emergency-${action.id}`} key={action.id}>
            <EmergencyCard
              action={action}
              isOpen={openId === action.id}
              onToggle={() => setOpenId(openId === action.id ? '' : action.id)}
              onNextAction={openNextAction}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
