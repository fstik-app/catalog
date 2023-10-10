import { CatalogSearch } from '@/features/catalog-search';
import { Menu } from '@/features/menu';


export const CatalogHeadWidget = () => (
  <>
    <div style={{ position: 'absolute', top: 0 }}>
      <CatalogSearch />
    </div>
    <Menu />
  </>
);
