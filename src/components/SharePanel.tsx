import { useState } from 'react';
import { emergencyActions } from '../data/emergencyActions';
import { findMunicipalityById } from '../data/municipalities';
import type { Municipality, SavedArea, SavedAreaRole, SourceLink } from '../types';

const savedAreaStorageKey = 'bousai-navi:saved-areas';

type ShareMode = 'family' | 'workplace';

type ShareResult = 'idle' | 'shared' | 'copied' | 'manual' | 'failed';

const roleLabels: Record<SavedAreaRole, string> = {
  home: '自宅',
  work: '職場',
  familyHome: '実家',
  frequent: 'よく行く場所',
};

function loadSavedAreasForShare(): { savedAreas: SavedArea[]; error?: string } {
  try {
    const rawValue = window.localStorage.getItem(savedAreaStorageKey);
    if (!rawValue) return { savedAreas: [] };
    const parsedValue = JSON.parse(rawValue) as SavedArea[];
    return { savedAreas: Array.isArray(parsedValue) ? parsedValue : [], error: Array.isArray(parsedValue) ? undefined : '登録エリアの保存データ形式を確認できませんでした。' };
  } catch {
    return { savedAreas: [], error: '登録エリアを読み込めませんでした。ブラウザの保存設定を確認してください。' };
  }
}

function findArea(savedAreas: SavedArea[], role: SavedAreaRole) {
  const savedArea = savedAreas.find((area) => area.role === role);
  return savedArea ? findMunicipalityById(savedArea.municipalityId) : undefined;
}

function formatMunicipality(municipality: Municipality | undefined) {
  return municipality ? `${municipality.prefecture} ${municipality.name}` : '未登録';
}

function formatLinks(municipality: Municipality | undefined) {
  if (!municipality) return ['・未登録のため、自治体リンクはアプリで登録してください。'];
  const realLinks = municipality.links.filter((link): link is SourceLink => !link.isPlaceholder && link.url !== '#');
  if (realLinks.length === 0) return ['・実リンク未設定。アプリ内の仮リンク表示を確認してください。'];
  return realLinks.map((link) => `・${link.label}: ${link.url}`);
}

function emergencySummaryLines() {
  const importantActions = ['shaking-now', 'after-shaking', 'contact-family', 'evacuate'];
  return importantActions.flatMap((id) => {
    const action = emergencyActions.find((item) => item.id === id);
    if (!action) return [];
    return [`【${action.title}】`, ...action.steps.slice(0, 3).map((step, index) => `${index + 1}. ${step}`)];
  });
}

function buildFamilyText(savedAreas: SavedArea[]) {
  const home = findArea(savedAreas, 'home');
  const familyHome = findArea(savedAreas, 'familyHome');
  const frequent = findArea(savedAreas, 'frequent');

  return [
    '【わが家の防災メモ】',
    '',
    `自宅の自治体: ${formatMunicipality(home)}`,
    `実家の自治体: ${formatMunicipality(familyHome)}`,
    `よく行く場所: ${formatMunicipality(frequent)}`,
    '',
    '確認する情報:',
    ...formatLinks(home),
    '',
    '連絡導線:',
    '・災害用伝言ダイヤル171',
    '・web171: https://www.web171.jp/',
    '・SNSやメッセージアプリは短文で送る',
    '',
    '地震直後の行動:',
    ...emergencySummaryLines(),
    '',
    '家族で決めておくこと:',
    '・集合場所',
    '・連絡手段',
    '・避難先',
    '・備蓄場所',
    '・ペットや高齢家族の支援方法',
    '',
    '※安全を断定せず、自治体の最新情報と周囲の状況を確認してください。',
  ].join('\n');
}

function buildWorkplaceText(savedAreas: SavedArea[]) {
  const work = findArea(savedAreas, 'work');
  const home = findArea(savedAreas, 'home');

  return [
    '【職場の防災共有メモ】',
    '',
    `職場自治体: ${formatMunicipality(work)}`,
    `従業員の主な居住自治体メモ: ${formatMunicipality(home)}`,
    '',
    '確認する情報:',
    ...formatLinks(work),
    '',
    '連絡導線:',
    '・従業員安否確認ルール',
    '・災害用伝言ダイヤル171',
    '・web171: https://www.web171.jp/',
    '・本社・拠点への報告メモ',
    '',
    '地震直後の行動:',
    ...emergencySummaryLines(),
    '',
    '職場で確認すること:',
    '・顧客対応',
    '・車両・設備確認',
    '・停電・断水などライフライン確認',
    '・帰宅困難時対応',
    '・無理な移動を避ける判断基準',
    '',
    '※勤務先ルールと自治体の最新情報を確認し、安全を優先してください。',
  ].join('\n');
}

function resultMessage(result: ShareResult) {
  if (result === 'shared') return '共有画面を開きました。';
  if (result === 'copied') return '共有テキストをクリップボードにコピーしました。';
  if (result === 'manual') return '自動共有またはコピーが使えないため、下のテキストを手動でコピーしてください。';
  if (result === 'failed') return '共有に失敗しました。下のテキストを手動でコピーしてください。';
  return '';
}

export function SharePanel() {
  const loaded = loadSavedAreasForShare();
  const [mode, setMode] = useState<ShareMode>('family');
  const [shareResult, setShareResult] = useState<ShareResult>('idle');
  const text = mode === 'family' ? buildFamilyText(loaded.savedAreas) : buildWorkplaceText(loaded.savedAreas);

  async function shareText() {
    setShareResult('idle');
    try {
      if (navigator.share) {
        await navigator.share({ title: mode === 'family' ? 'わが家の防災メモ' : '職場の防災共有メモ', text });
        setShareResult('shared');
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setShareResult('copied');
        return;
      }
      setShareResult('manual');
    } catch {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          setShareResult('copied');
          return;
        }
      } catch {
        // 手動コピーへフォールバックする。
      }
      setShareResult('failed');
    }
  }

  return (
    <section className="section-card share-panel" aria-labelledby="share-panel-title">
      <p className="eyebrow">Share</p>
      <h3 id="share-panel-title">共有メモ</h3>
      <p>登録エリア、自治体リンク、緊急行動カード、171/web171をもとに、LINEやメールへ貼り付けやすい文章を生成します。</p>
      {loaded.error && <p className="notice-text" role="status">{loaded.error}</p>}
      <div className="share-mode-switch" role="group" aria-label="共有メモの種類">
        <button type="button" className={mode === 'family' ? 'selected' : undefined} onClick={() => setMode('family')}>家族向け</button>
        <button type="button" className={mode === 'workplace' ? 'selected' : undefined} onClick={() => setMode('workplace')}>職場向け</button>
      </div>
      <button type="button" className="primary-action share-action" onClick={shareText}>
        {mode === 'family' ? '家族向けメモを共有・コピー' : '職場向けメモを共有・コピー'}
      </button>
      {resultMessage(shareResult) && <p className="share-status" role="status">{resultMessage(shareResult)}</p>}
      <label className="search-label" htmlFor="share-text">手動コピー用テキスト</label>
      <textarea id="share-text" className="share-textarea" value={text} readOnly rows={14} aria-describedby="share-help" />
      <p id="share-help" className="offline-note">Web Share APIやクリップボードが使えない場合は、この欄を選択して手動でコピーしてください。個人の電話番号や氏名は保存しません。</p>
    </section>
  );
}
