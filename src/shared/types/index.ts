export interface BoardLabel {
  id: string;
  color: string;
  name: string | null;
  position?: number;
}

export interface CardLabel extends BoardLabel {
  checked: boolean;
}

export interface CardLink {
  icon?: string;
  text: string;
}

export interface CardTimeline {
  id: string;
  type: "COMMENT" | "ACTIVITY";
  authorName: string;
  initials: string | null;
  text: string | null;
  activityText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CardData {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  coverColor?: string;
  labels?: CardLabel[];
  boardLabels?: BoardLabel[];
  checklist?: { done: number; total: number };
  attachments?: number;
  hasDescription?: boolean;
  watching?: boolean;
  assignee?: { initials: string; color: string };
  links?: CardLink[];
  comments?:CardTimeline[],
  column: ColumnInt;
  numberBadge?: number;
  dueDate?: Date;
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