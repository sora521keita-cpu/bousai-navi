import type { Municipality, SourceLink } from '../types';

const placeholderLinks = (name: string): SourceLink[] => ([
  {
    label: '防災ページ（仮リンク）',
    url: '#',
    sourceType: 'placeholder',
    isPlaceholder: true,
  },
  {
    label: 'ハザードマップ（仮リンク）',
    url: '#',
    sourceType: 'placeholder',
    isPlaceholder: true,
  },
  {
    label: '避難所・避難場所情報（仮リンク）',
    url: '#',
    sourceType: 'placeholder',
    isPlaceholder: true,
  },
  {
    label: 'ライフライン情報（仮リンク）',
    url: '#',
    sourceType: 'placeholder',
    isPlaceholder: true,
  },
] satisfies SourceLink[]).map((link) => ({ ...link, label: `${name} ${link.label}` }));

const official = (label: string, url: string): SourceLink => ({
  label,
  url,
  sourceType: 'official',
});

export const municipalities: Municipality[] = [
  {
    id: 'tokyo-shinjuku',
    prefecture: '東京都',
    name: '新宿区',
    municipalityCode: '13104',
    links: [
      official('新宿区 公式サイト', 'https://www.city.shinjuku.lg.jp/'),
      official('新宿区 ハザードマップ', 'https://www.city.shinjuku.lg.jp/anzen/anshin00_100002.html'),
      ...placeholderLinks('新宿区').filter((link) => !link.label.includes('ハザードマップ')),
    ],
    notes: '防災関連リンクは後続段階で追加確認する前提のサンプルです。',
  },
  {
    id: 'tokyo-setagaya',
    prefecture: '東京都',
    name: '世田谷区',
    municipalityCode: '13112',
    links: [official('世田谷区 公式サイト', 'https://www.city.setagaya.lg.jp/'), ...placeholderLinks('世田谷区')],
  },
  {
    id: 'tokyo-koto',
    prefecture: '東京都',
    name: '江東区',
    municipalityCode: '13108',
    links: [official('江東区 公式サイト', 'https://www.city.koto.lg.jp/'), ...placeholderLinks('江東区')],
  },
  {
    id: 'saitama-saitama',
    prefecture: '埼玉県',
    name: 'さいたま市',
    municipalityCode: '11100',
    links: [official('さいたま市 公式サイト', 'https://www.city.saitama.lg.jp/'), ...placeholderLinks('さいたま市')],
  },
  {
    id: 'saitama-kawaguchi',
    prefecture: '埼玉県',
    name: '川口市',
    municipalityCode: '11203',
    links: [official('川口市 公式サイト', 'https://www.city.kawaguchi.lg.jp/'), ...placeholderLinks('川口市')],
  },
  {
    id: 'saitama-kitamoto',
    prefecture: '埼玉県',
    name: '北本市',
    municipalityCode: '11233',
    links: [official('北本市 公式サイト', 'https://www.city.kitamoto.lg.jp/'), ...placeholderLinks('北本市')],
  },
  {
    id: 'saitama-koshigaya',
    prefecture: '埼玉県',
    name: '越谷市',
    municipalityCode: '11222',
    links: [official('越谷市 公式サイト', 'https://www.city.koshigaya.saitama.jp/'), ...placeholderLinks('越谷市')],
  },
  {
    id: 'chiba-chiba',
    prefecture: '千葉県',
    name: '千葉市',
    municipalityCode: '12100',
    links: [official('千葉市 公式サイト', 'https://www.city.chiba.jp/'), ...placeholderLinks('千葉市')],
  },
  {
    id: 'chiba-funabashi',
    prefecture: '千葉県',
    name: '船橋市',
    municipalityCode: '12204',
    links: [official('船橋市 公式サイト', 'https://www.city.funabashi.lg.jp/'), ...placeholderLinks('船橋市')],
  },
  {
    id: 'chiba-ichikawa',
    prefecture: '千葉県',
    name: '市川市',
    municipalityCode: '12203',
    links: [official('市川市 公式サイト', 'https://www.city.ichikawa.lg.jp/'), ...placeholderLinks('市川市')],
  },
  {
    id: 'kanagawa-yokohama',
    prefecture: '神奈川県',
    name: '横浜市',
    municipalityCode: '14100',
    links: [
      official('横浜市 公式サイト', 'https://www.city.yokohama.lg.jp/'),
      official('横浜市 防災の地図', 'https://www.city.yokohama.lg.jp/bousai-kyukyu-bohan/bousai-saigai/map/map.html'),
      ...placeholderLinks('横浜市').filter((link) => !link.label.includes('ハザードマップ')),
    ],
  },
  {
    id: 'kanagawa-kawasaki',
    prefecture: '神奈川県',
    name: '川崎市',
    municipalityCode: '14130',
    links: [official('川崎市 公式サイト', 'https://www.city.kawasaki.jp/'), ...placeholderLinks('川崎市')],
  },
  {
    id: 'kanagawa-sagamihara',
    prefecture: '神奈川県',
    name: '相模原市',
    municipalityCode: '14150',
    links: [official('相模原市 公式サイト', 'https://www.city.sagamihara.kanagawa.jp/'), ...placeholderLinks('相模原市')],
  },
];

export const prefectures = Array.from(new Set(municipalities.map((municipality) => municipality.prefecture)));

export function findMunicipalityById(id: string) {
  return municipalities.find((municipality) => municipality.id === id);
}
