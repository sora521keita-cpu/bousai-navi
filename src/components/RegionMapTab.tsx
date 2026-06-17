import { useState } from 'react';
import { findMunicipalityById, municipalities, prefectures } from '../data/municipalities';
import type { Municipality, SavedArea, SavedAreaRole, SourceLink } from '../types';

type RegionMapTabProps = {
  onEmergencyClick: () => void;
};

const storageKey = 'bousai-navi:saved-areas';

const roleLabels: Record<SavedAreaRole, string> = {
  home: '自宅',
  work: '職場',
  familyHome: '実家',
  frequent: 'よく行く場所',
};

const savedAreaRoles: SavedAreaRole[] = ['home', 'work', 'familyHome', 'frequent'];

function loadSavedAreas(): SavedArea[] {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue) as SavedArea[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function saveAreasToStorage(savedAreas: SavedArea[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(savedAreas));
    return true;
  } catch {
    return false;
  }
}

function describeSavedArea(savedAreas: SavedArea[], role: SavedAreaRole) {
  const savedArea = savedAreas.find((area) => area.role === role);
  if (!savedArea) return '未登録';
  const municipality = findMunicipalityById(savedArea.municipalityId);
  return municipality ? `${municipality.prefecture} ${municipality.name}` : '未登録';
}

function LinkBadge({ link }: { link: SourceLink }) {
  const labelByType: Record<SourceLink['sourceType'], string> = {
    official: '公式',
    public: '公的',
    infrastructure: 'ライフライン',
    placeholder: '仮リンク',
  };
  return <span className={link.isPlaceholder ? 'link-badge placeholder' : 'link-badge'}>{labelByType[link.sourceType]}</span>;
}

function MunicipalityLinks({ links }: { links: SourceLink[] }) {
  return (
    <ul className="municipality-links">
      {links.map((link) => (
        <li key={`${link.label}-${link.url}`}>
          <div>
            <strong>{link.label}</strong>
            {link.isPlaceholder && <p>これは仮リンクです。URL確認後に実リンクへ差し替えます。</p>}
          </div>
          <div className="link-action">
            <LinkBadge link={link} />
            {link.isPlaceholder ? (
              <span className="disabled-link" aria-label={`${link.label}は仮リンクです`}>未確認</span>
            ) : (
              <a href={link.url} target="_blank" rel="noreferrer">開く</a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function MunicipalityDetail({ municipality, onSaveArea }: { municipality: Municipality; onSaveArea: (role: SavedAreaRole, municipalityId: string) => void }) {
  return (
    <article className="municipality-detail">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Municipality</p>
          <h3>{municipality.name}</h3>
          <p>{municipality.prefecture}{municipality.municipalityCode ? ` / 自治体コード: ${municipality.municipalityCode}` : ''}</p>
        </div>
      </div>
      {municipality.notes && <p className="notice-text">{municipality.notes}</p>}
      <h4>公式情報リンク</h4>
      <MunicipalityLinks links={municipality.links} />
      <h4>登録する</h4>
      <div className="save-area-grid">
        {savedAreaRoles.map((role) => (
          <button key={role} type="button" onClick={() => onSaveArea(role, municipality.id)}>
            {roleLabels[role]}に登録
          </button>
        ))}
      </div>
    </article>
  );
}

export function RegionMapTab({ onEmergencyClick }: RegionMapTabProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>(prefectures[0] ?? '東京都');
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(municipalities[0]?.id ?? '');
  const [searchText, setSearchText] = useState('');
  const [locationMessage, setLocationMessage] = useState('');
  const [savedAreas, setSavedAreas] = useState<SavedArea[]>(() => loadSavedAreas());
  const [storageMessage, setStorageMessage] = useState('');

  const filteredMunicipalities = municipalities.filter((municipality) => {
    const matchesPrefecture = municipality.prefecture === selectedPrefecture;
    const matchesSearch = searchText.trim() === '' || `${municipality.prefecture}${municipality.name}`.includes(searchText.trim());
    return matchesPrefecture && matchesSearch;
  });
  const selectedMunicipality = findMunicipalityById(selectedMunicipalityId) ?? filteredMunicipalities[0] ?? municipalities[0];

  function selectPrefecture(prefecture: string) {
    setSelectedPrefecture(prefecture);
    const firstMunicipality = municipalities.find((municipality) => municipality.prefecture === prefecture);
    setSelectedMunicipalityId(firstMunicipality?.id ?? '');
  }

  function saveArea(role: SavedAreaRole, municipalityId: string) {
    const nextSavedAreas = [...savedAreas.filter((area) => area.role !== role), { role, municipalityId }];
    setSavedAreas(nextSavedAreas);
    setStorageMessage(saveAreasToStorage(nextSavedAreas) ? `${roleLabels[role]}を登録しました。` : '登録エリアを保存できませんでした。ブラウザの保存設定を確認してください。');
  }

  return (
    <section className="tab-content region-tab">
      <div className="hero-card">
        <h2>登録エリア</h2>
        <dl className="area-list">
          {savedAreaRoles.map((role) => (
            <div key={role}>
              <dt>{roleLabels[role]}</dt>
              <dd>{describeSavedArea(savedAreas, role)}</dd>
            </div>
          ))}
        </dl>
        {storageMessage && <p className="share-status" role="status">{storageMessage}</p>}
        <div className="action-row">
          <button type="button" className="primary-action" onClick={() => document.getElementById('municipality-search')?.focus()}>自治体を探す</button>
          <button type="button" className="secondary-action" onClick={onEmergencyClick}>緊急時の行動を見る</button>
        </div>
      </div>

      <div className="section-card">
        <div className="section-heading">
          <h3>地域マップ</h3>
          <span className="status-pill">第二段階: 簡易選択</span>
        </div>
        <div className="map-placeholder" role="img" aria-label="日本地図の仮表示">
          <span>🗾</span>
          <p>本格的なGIS描画は行わず、都道府県と自治体リストから選択します。</p>
        </div>
        <div className="split-actions">
          <button type="button" onClick={() => setLocationMessage('現在地判定は今後実装予定です。許可なく位置情報は取得しません。')}>現在地から探す</button>
          <button type="button" onClick={() => setLocationMessage('日本地図のクリック選択は今後実装予定です。下の都道府県から選んでください。')}>日本地図から探す</button>
        </div>
        {locationMessage && <p className="notice-text">{locationMessage}</p>}
      </div>

      <div className="section-card">
        <label className="search-label" htmlFor="municipality-search">自治体名検索</label>
        <input
          id="municipality-search"
          className="search-input"
          type="search"
          value={searchText}
          placeholder="例: 新宿区、横浜市"
          onChange={(event: { target: { value: string } }) => setSearchText(event.target.value)}
        />
      </div>

      <div className="section-card">
        <h3>都道府県選択</h3>
        <div className="prefecture-grid">
          {prefectures.map((prefecture) => (
            <button
              key={prefecture}
              type="button"
              className={selectedPrefecture === prefecture ? 'selected' : undefined}
              onClick={() => selectPrefecture(prefecture)}
            >
              {prefecture}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3>自治体一覧</h3>
        <div className="municipality-list">
          {filteredMunicipalities.map((municipality) => (
            <button
              key={municipality.id}
              type="button"
              className={selectedMunicipality?.id === municipality.id ? 'selected' : undefined}
              onClick={() => setSelectedMunicipalityId(municipality.id)}
            >
              <strong>{municipality.name}</strong>
              <span>{municipality.prefecture}</span>
            </button>
          ))}
        </div>
        {filteredMunicipalities.length === 0 && <p className="notice-text">該当するサンプル自治体がありません。</p>}
      </div>

      {selectedMunicipality && (
        <MunicipalityDetail municipality={selectedMunicipality} onSaveArea={saveArea} />
      )}
    </section>
  );
}
