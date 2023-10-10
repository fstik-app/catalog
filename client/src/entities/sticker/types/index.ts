import type { ISticker } from '@/types';


export type SelectedSticker = null | {animated?: boolean } & Partial<ISticker>;
