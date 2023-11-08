import { ISticker } from '@/types';


export interface StickersProps {
  stickers: ISticker[];
  packIndex: number;
  isAndroid: boolean;
  type: string;
  onClick?: AnyToVoidFunction;
  showFull?: boolean;
  kind: string;
}
