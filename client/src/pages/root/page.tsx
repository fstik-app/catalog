import { usePageTitle } from '@/shared/hooks';
import { SelectedSticker } from '@/features/sticker-select';
import { Catalog, CatalogHeadWidget, CatalogFooterWidget } from '@/widgets';


export const RootPage = () => {
  usePageTitle();

  return (
    <>
      <CatalogHeadWidget/>
      <SelectedSticker/>
      <Catalog />
      <CatalogFooterWidget />
    </>
  );
};

