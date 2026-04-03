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

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  status: WorkspaceMemberStatus;
  lastActive: Date; 

  boards: Board;

  user: User;
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
  id: string;
  url: string;
  icon?: string;
  text: string;
  createdAt: string;
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

export interface CardAttachment {
  id: string;
  cardId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number | null;
  mimeType?: string | null;
  uploadedBy?: string | null;
  createdAt: string; 
}

export type SizeOption = "WIDE" | "TALL";

export interface CardData {
  id: string;
  title?: string;
  description?: string;
  image?: string;

  numberBadge?: number;

  hasDescription?: boolean;
  watching?: boolean;

  // attachments?: number;

  checklist?: {
    done: number;
    total: number;
  };

  coverColor: string;

  labels?: CardLabel[];
  boardLabels?: BoardLabel[];

  members?: CardMember[]; 

  links?: CardLink[];
  comments?: CardTimeline[];

  attachments: CardAttachment[];
  column: ColumnInt;

  dueDate?: string | null;
  isCompleted: boolean;

  isImage?: boolean;
  background?: string | null; 
  size?: SizeOption;
}

export interface ColumnInt {
  id: string;
  title: string;
  cards: CardData[];
}

export type BoardMemberRole = "OWNER" | "ADMIN" | "MEMBER";
export type BoardMemberStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface BoardMember {
  id: string;          
  boardId: number;     
  userId: string;      
  role: BoardMemberRole;      
  status: BoardMemberStatus;  

  user: User;

  createdAt: Date;     
  updatedAt: Date;     
}

export interface Board {
  id: number;
  title: string;
  bg: string;
  isPhoto: boolean;
  workspaceId: string;
  
  columns: ColumnInt[];
  labels: BoardLabel[];
  members: BoardMember[];
}