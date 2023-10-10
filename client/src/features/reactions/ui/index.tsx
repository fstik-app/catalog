import type { ReactionsProps } from '../types';
import { reactFx } from '../api';
import {
  banUserFx,
  updateStickerSetPublicFx,
  updateStickerSetSafeFx,
} from '../api';

import styles from './reactions.module.scss';

import { roundReaction } from '@/shared/lib/utils';
import { REACTION_ENUM } from '@/types';
import { ReactionButton } from '@/shared/ui';
import { recommendationsRequested } from '@/shared/recommendations';


export const Reactions = (
  {
    like,
    dislike,
    current,
    id,
    isModerator,
    safe,
    banned,
    public: isPublic,
    withRecommendations,
  }: ReactionsProps,
) => {
  return (
    <div className={styles.Likes}>
      <div>
        <ReactionButton
          type={REACTION_ENUM.LIKE}
          enabled={REACTION_ENUM.LIKE === current}
          text={String(roundReaction(like))}
          onClick={() => {
            reactFx([id, REACTION_ENUM.LIKE]);
            if (withRecommendations &&
              current !== REACTION_ENUM.LIKE
            ) {
              recommendationsRequested([id]);
            }
          }}
        />
        <ReactionButton
          onClick={() => reactFx([id, REACTION_ENUM.DISLIKE])}
          type={REACTION_ENUM.DISLIKE}
          enabled={REACTION_ENUM.DISLIKE === current}
          text={String(roundReaction(dislike))}
        />
      </div>
      <div>
        {
          isModerator && (
            <>
              <ReactionButton
                onClick={() => banUserFx(id)}
                enabled={banned}
                text={banned ? '🙅' : '🙍'}
              />
              <ReactionButton
                onClick={() => updateStickerSetSafeFx(id)}
                enabled={!safe}
                text={safe ? '✅' : '🔞'}
              />
              <ReactionButton
                onClick={() => updateStickerSetPublicFx(id)}
                enabled={!isPublic}
                text='📢'
              />
            </>
          )
        }
      </div>
    </div>
  );
};
