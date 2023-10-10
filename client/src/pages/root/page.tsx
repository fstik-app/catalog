import { SelectedSticker } from '@/features/sticker-select';
import { Catalog } from '@/widgets/catalog-list';
import { CatalogHeadWidget } from '@/widgets/catalog-head';
import { usePageTitle } from '@/shared/hooks';


export const RootPage = () => {
  usePageTitle();

  return (
    <>
      <CatalogHeadWidget/>
      <SelectedSticker/>
      <Catalog />
    </>
  );
};

