export * from './sticker-set';

export enum REACTION_ENUM {
  LIKE = 'like',
  DISLIKE = 'dislike',
}


export interface SearchStickersSetsFxInterface {
  query?: string;
  page?: number;
  limit?: number;
  skip?: number;
  public?: boolean;
}

export type ReactStickerSetType = [stickerSetId: string, type: REACTION_ENUM];


declare global {
  interface Window {
    $RefreshReg$: AnyToVoidFunction,
    $RefreshSig$: AnyToVoidFunction,
    changeLocale?: (l: string) => void,
  }
}
export * from './api';
