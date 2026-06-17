import { findEmergencyActionById } from '../data/emergencyActions';
import type { EmergencyAction } from '../types';

type EmergencyCardProps = {
  action: EmergencyAction;
  isOpen: boolean;
  onToggle: () => void;
  onNextAction: (actionId: string) => void;
};

export function EmergencyCard({ action, isOpen, onToggle, onNextAction }: EmergencyCardProps) {
  return (
    <article className={isOpen ? 'emergency-card open' : 'emergency-card'}>
      <button type="button" className="emergency-card-button" aria-expanded={isOpen} onClick={onToggle}>
        <span>
          <strong>{action.title}</strong>
          <small>{action.summary}</small>
        </span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="emergency-steps">
          {action.offlineAvailable && <p className="offline-note">この手順はオフラインでも確認できる想定です。</p>}
          {action.warning && <p className="warning-note">{action.warning}</p>}
          <ol>
            {action.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          {action.nextActionIds && action.nextActionIds.length > 0 && (
            <div className="next-actions">
              <h4>次に確認する行動</h4>
              <div className="next-action-buttons">
                {action.nextActionIds.map((nextActionId) => {
                  const nextAction = findEmergencyActionById(nextActionId);
                  return nextAction ? (
                    <button key={nextActionId} type="button" onClick={() => onNextAction(nextActionId)}>
                      {nextAction.title}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {action.relatedLinks && action.relatedLinks.length > 0 && (
            <div className="related-links">
              <h4>補助リンク</h4>
              <p>通信できる場合だけ確認してください。外部リンクを開かなくても上の手順は読めます。</p>
              {action.relatedLinks.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}（{link.sourceName} / 信頼度{link.trustRank}）
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
