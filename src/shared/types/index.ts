export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "MEMBER"
  | "VIEWER";

export type WorkspaceMemberStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED";

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  status: WorkspaceMemberStatus;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}

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

export interface CardMember {
  id: string;
  user: User;
}

export interface CardData {
  id: string;
  title?: string;
  description?: string;
  image?: string;

  numberBadge?: number;

  hasDescription?: boolean;
  watching?: boolean;

  attachments?: number;

  checklist?: {
    done: number;
    total: number;
  };

  labels?: CardLabel[];
  boardLabels?: BoardLabel[];

  members?: CardMember[]; 

  links?: CardLink[];
  comments?: CardTimeline[];

  column: ColumnInt;

  dueDate?: string | null;
  isCompleted: boolean;
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
  workspaceId: string;
  columns: ColumnInt[];
}