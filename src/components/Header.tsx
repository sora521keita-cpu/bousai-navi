type HeaderProps = {
  onEmergencyClick: () => void;
};

export function Header({ onEmergencyClick }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">BousaiNavi</p>
        <h1>わが家の防災ナビ</h1>
        <p>自治体別の防災情報と緊急時の行動をまとめて確認できます。</p>
      </div>
      <button className="emergency-button" type="button" onClick={onEmergencyClick}>
        緊急
      </button>
    </header>
  );
}
