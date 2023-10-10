import type { FC } from 'react';

import { Reactions } from '../reactions/ui';

import { Header, AddButtonRound } from './header';
import { Stickers } from './stickers';

import { usePageTitle, usePageDescription } from '@/shared/hooks';
import type { IStickerSet } from '@/types';
import { stickerSelected } from '@/entities/sticker/model';


interface StickerSetComponentInterface {
  stickerSet: IStickerSet;
  isModerator?: boolean;
}

export const StickerSetFull: FC<StickerSetComponentInterface> = (
  {
    stickerSet,
    isModerator = false,
  },
) => {
  usePageTitle(stickerSet.title);
  usePageDescription(stickerSet.description);

  return (
    <div>
      <Header
        description={stickerSet.description}
        isModerator={isModerator}
        name={stickerSet.name}
        stickerSetId={stickerSet.id}
        tags={stickerSet.tags}
        title={stickerSet.title}
        isTagsOpen={true}
        addButton={false}
        length={stickerSet.stickers.length}
      />
      <Reactions
        like={stickerSet.reaction.like}
        dislike={stickerSet.reaction.dislike}
        current={stickerSet.reaction.current}
        isModerator={isModerator}
        id={stickerSet.id}
        safe={stickerSet.safe}
        banned={stickerSet.banned}
        key={stickerSet.id}
        public={stickerSet.public}
      />
      <Stickers
        type={stickerSet.type}
        stickers={stickerSet.stickers}
        isAndroid={true}
        showFull
        onClick={stickerSelected}
        packIndex={0}
      />
      <AddButtonRound
        name={stickerSet.name}
        length={stickerSet.stickers.length}
      />
    </div>
  );
};
