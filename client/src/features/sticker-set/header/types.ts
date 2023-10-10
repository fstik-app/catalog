export interface HeaderProps {
  name: string;
  title: string;
  description: string;
  stickerSetId: string;
  currentOs?: string;
  tags: string[];
  length?: number;
  isModerator: boolean;
  isTagsOpen?: boolean;
  addButton?: boolean;
}
