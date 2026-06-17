import { libraryCategoryLabels } from '../data/libraryItems';
import type { LibraryItem } from '../types';

type LibraryCardProps = {
  item: LibraryItem;
};

const trustDescriptions: Record<LibraryItem['trustRank'], string> = {
  A: '一次情報',
  B: '公共性の高い情報',
  C: '民間・報道等',
  D: '未確認情報',
};

export function LibraryCard({ item }: LibraryCardProps) {
  const hasExternalLink = item.sourceUrl !== '#';

  return (
    <article className="library-card">
      <div className="card-meta">
        <span className={`trust-rank rank-${item.trustRank}`}>信頼度{item.trustRank}: {trustDescriptions[item.trustRank]}</span>
        {item.canSaveOffline && <span>オフライン確認可</span>}
        {item.estimatedReadMinutes && <span>約{item.estimatedReadMinutes}分</span>}
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="category-tags">
        {item.category.map((category) => <span key={category}>{libraryCategoryLabels[category]}</span>)}
      </div>
      <p className="source-note">情報源: {item.sourceName}</p>
      {hasExternalLink ? (
        <a className="resource-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
          公式情報を開く
        </a>
      ) : (
        <p className="offline-note">外部リンクなし。アプリ内メモとして確認できます。</p>
      )}
    </article>
  );
}
