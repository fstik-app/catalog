import { IStickerSet, IReaction } from '@/types';


export interface ReactionsProps
  extends IReaction,
    Pick<IStickerSet, 'id' | 'safe' | 'public' | 'banned'> {
  isModerator: boolean;
  withRecommendations?: boolean;
}
