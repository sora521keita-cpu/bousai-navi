export type TabId = 'region' | 'library' | 'emergency';

export type TrustRank = 'A' | 'B' | 'C' | 'D';

export type LibraryCategory =
  | 'earthquake'
  | 'tsunami'
  | 'flood'
  | 'landslide'
  | 'lifeline'
  | 'stockpile'
  | 'family'
  | 'workplace'
  | 'apartment'
  | 'pet'
  | 'elderly'
  | 'foreignResident';

export type UserAttribute =
  | 'single'
  | 'family'
  | 'elderlyFamily'
  | 'pet'
  | 'apartment'
  | 'car'
  | 'workplace';

export type LibraryItem = {
  id: string;
  title: string;
  summary: string;
  category: LibraryCategory[];
  targetUsers: UserAttribute[];
  sourceName: string;
  sourceUrl: string;
  trustRank: TrustRank;
  estimatedReadMinutes?: number;
  canSaveOffline?: boolean;
};

export type EmergencyRelatedLink = {
  label: string;
  url: string;
  sourceName: string;
  trustRank: TrustRank;
};

export type EmergencyAction = {
  id: string;
  title: string;
  summary: string;
  priority: number;
  steps: string[];
  nextActionIds?: string[];
  warning?: string;
  relatedLinks?: EmergencyRelatedLink[];
  offlineAvailable: boolean;
};

export type SourceType = 'official' | 'public' | 'infrastructure' | 'placeholder';

export type SourceLink = {
  label: string;
  url: string;
  sourceType: SourceType;
  isPlaceholder?: boolean;
};

export type Municipality = {
  id: string;
  prefecture: string;
  name: string;
  municipalityCode?: string;
  links: SourceLink[];
  notes?: string;
};

export type SavedAreaRole = 'home' | 'work' | 'familyHome' | 'frequent';

export type SavedArea = {
  role: SavedAreaRole;
  municipalityId: string;
  label?: string;
};
