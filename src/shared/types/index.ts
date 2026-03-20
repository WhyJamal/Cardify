export interface CardLabel {
  id: string;
  color: string;
  text?: string;
}

export interface CardLink {
  icon?: string;
  text: string;
}

export interface CardData {
  id: string;
  title?: string;
  image?: string;
  coverColor?: string;
  labels?: CardLabel[];
  checklist?: { done: number; total: number };
  attachments?: number;
  hasDescription?: boolean;
  watching?: boolean;
  assignee?: { initials: string; color: string };
  links?: CardLink[];
  numberBadge?: number;
}

export interface ColumnInt {
  id: string;
  title: string;
  cards: CardData[];
}

export interface Board {
  id: number;
  title: string;
  bg: string;
  isPhoto: boolean;
}