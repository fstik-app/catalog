import { REACTION_ENUM } from '.';

import { CATALOG_KIND_ENUM } from '@/shared/constants';


export interface ISticker {
  width: number;
  height: number;
  file_id: string;
  thumb?: {
    width: number;
    height: number;
    file_id: string;
  }
}

export interface IReaction {
  like: number;
  dislike: number;
  current: REACTION_ENUM | null;
}

export enum StickerSetEnum {
  ANIMATED = 'animated',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IStickerSet {
  id: string;
  index: number;
  name: string;
  title: string;
  description: string;
  tags: string[];

  languages: [];

  reaction: IReaction;

  stickers: ISticker[];

  type: StickerSetEnum;
  kind: CATALOG_KIND_ENUM;

  safe: true;
  banned?: boolean;
  public?: boolean;
}

export interface IStickerSetId {
  stickerSetId: string
}

export type ISafe = Pick<IStickerSet, 'safe'>;
export type IBanned = Pick<IStickerSet, 'banned'>;
export type IPublic = Pick<IStickerSet, 'public'>;

export type IStickerStatus = ISafe | IBanned | IPublic;
