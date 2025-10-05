export interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  tags: string[];
  ownerId: string;
  sharedWith: SharedWith[];
  attachments: string[];
  archived: boolean;
  isFavorite: boolean;
  lastEdited: Date;
  version: number;
  // metadata: Metadata;
}

// export interface Metadata {
//   wordCount: number;
//   readTimeMin: number;
// }

export interface SharedWith {
  id: string;
  role: string;
}
