import { FC, useMemo } from 'react';
import { useUnit } from 'effector-react';

import { ReactionsUi } from '../reactions';

import { Header } from './header';
import { Stickers } from './stickers';

import { $isModerator } from '@/shared/session';
import { IStickerSet } from '@/types';
import { useStickerSet } from '@/shared/hooks/use-stickerSet';
import 'swiper/scss';
import 'swiper/scss/free-mode';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { getMobileOS } from '@/shared/lib/utils';
import { IS_ANDROID } from '@/shared/environment';
import { stickerSelected } from '@/entities/sticker/model';
import { $catalogKind } from '@/entities/menu/model';


type StickerSetProps =
  | { index: number, stickerSetId: string, stickerSet?: undefined }
  | { index: number, stickerSet: IStickerSet, stickerSetId?: undefined };


export const StickerSet: FC<StickerSetProps> = ({
  index,
  stickerSetId,
  stickerSet,
})=> {
  const isModerator = useUnit($isModerator);
  const catalogKind = useUnit($catalogKind);
  const currentOs = useMemo(getMobileOS, []);

  const set = useStickerSet(stickerSetId);

  const data = stickerSet || set;

  if (!data) {
    return null;
  }

  const { reaction, stickers, ...stickerSetRest } = data;

  return (<>
    <Header
      name={stickerSetRest.name}
      title={stickerSetRest.title}
      currentOs={currentOs}
      stickerSetId={data.id}
      tags={stickerSetRest.tags}
      description={stickerSetRest.description}
      isModerator={isModerator}
    />
    <Stickers
      type={stickerSetRest.type}
      kind={data.kind}
      stickers={stickers}
      isAndroid={IS_ANDROID}
      packIndex={index}
      onClick={stickerSelected}
    />
    <ReactionsUi.Reactions
      id={data.id}
      like={reaction.like}
      dislike={reaction.dislike}
      current={reaction.current}
      isModerator={isModerator}
      safe={stickerSetRest.safe}
      banned={stickerSetRest.banned}
      public={stickerSetRest.public}
      sponsored={data.sponsored}
      withRecommendations
    />
  </>);
};
