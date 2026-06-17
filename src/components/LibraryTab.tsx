import { useState } from 'react';
import { libraryCategories, libraryCategoryLabels, libraryItems, userAttributeLabels, userAttributes } from '../data/libraryItems';
import type { LibraryCategory, UserAttribute } from '../types';
import { LibraryCard } from './LibraryCard';
import { SharePanel } from './SharePanel';

const filterStorageKey = 'bousai-navi:library-user-attributes';

type CategoryFilter = LibraryCategory | 'recommended';

function loadUserAttributes(): UserAttribute[] {
  try {
    const rawValue = window.localStorage.getItem(filterStorageKey);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue) as UserAttribute[];
    return Array.isArray(parsedValue) ? parsedValue.filter((value): value is UserAttribute => userAttributes.includes(value as UserAttribute)) : [];
  } catch {
    return [];
  }
}

function saveUserAttributes(attributes: UserAttribute[]) {
  try {
    window.localStorage.setItem(filterStorageKey, JSON.stringify(attributes));
    return true;
  } catch {
    return false;
  }
}

export function LibraryTab() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('recommended');
  const [selectedAttributes, setSelectedAttributes] = useState<UserAttribute[]>(() => loadUserAttributes());
  const [storageMessage, setStorageMessage] = useState('');

  function toggleAttribute(attribute: UserAttribute) {
    const nextAttributes = selectedAttributes.includes(attribute)
      ? selectedAttributes.filter((value) => value !== attribute)
      : [...selectedAttributes, attribute];
    setSelectedAttributes(nextAttributes);
    setStorageMessage(saveUserAttributes(nextAttributes) ? '属性フィルターを保存しました。' : '属性フィルターを保存できませんでした。ブラウザの保存設定を確認してください。');
  }

  const filteredItems = libraryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'recommended' || item.category.includes(selectedCategory);
    const matchesAttribute = selectedAttributes.length === 0 || item.targetUsers.some((attribute) => selectedAttributes.includes(attribute));
    return matchesCategory && matchesAttribute;
  });

  return (
    <section className="tab-content">
      <div className="section-intro">
        <p className="eyebrow">Library</p>
        <h2>防災ライブラリ</h2>
        <p>信頼度A/Bを優先し、カテゴリとあなたに近い属性から確認しやすくします。外部リンクは補助で、オフライン時はアプリ内メモを優先してください。</p>
      </div>

      <div className="section-card">
        <h3>信頼度ラベル</h3>
        <dl className="trust-legend">
          <div><dt>A</dt><dd>国・気象庁・消防庁・自治体・NTTなどの一次情報</dd></div>
          <div><dt>B</dt><dd>公的外郭団体や公共性の高い団体</dd></div>
          <div><dt>C</dt><dd>報道機関・民間企業の解説</dd></div>
          <div><dt>D</dt><dd>個人ブログ・SNS・出所不明情報</dd></div>
        </dl>
      </div>

      <div className="section-card">
        <h3>カテゴリ</h3>
        <div className="filter-chips" role="group" aria-label="防災ライブラリカテゴリ">
          {libraryCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'selected' : undefined}
              onClick={() => setSelectedCategory(category)}
            >
              {libraryCategoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3>あなたに近いものを選んでください</h3>
        <div className="attribute-grid">
          {userAttributes.map((attribute) => (
            <label key={attribute} className={selectedAttributes.includes(attribute) ? 'attribute-option selected' : 'attribute-option'}>
              <input
                type="checkbox"
                checked={selectedAttributes.includes(attribute)}
                onChange={() => toggleAttribute(attribute)}
              />
              <span>{userAttributeLabels[attribute]}</span>
            </label>
          ))}
        </div>
        {storageMessage && <p className="share-status" role="status">{storageMessage}</p>}
      </div>

      <div className="card-stack">
        {filteredItems.map((item) => <LibraryCard key={item.id} item={item} />)}
      </div>
      {filteredItems.length === 0 && <p className="notice-text">条件に合う資料がありません。カテゴリや属性を減らして確認してください。</p>}
      <SharePanel />
    </section>
  );
}
