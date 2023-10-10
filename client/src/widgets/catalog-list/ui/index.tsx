import { useUnit } from 'effector-react';
import { AutoSizer, InfiniteLoader, List, ListRowProps, OnScrollParams, WindowScroller } from 'react-virtualized';
import { useState } from 'react';

import { CatalogList, CatalogItem } from '@/shared/ui';
import { StickerSet } from '@/features/sticker-set';
import { $$stickerSetIds, $stickerSets } from '@/entities/sticker-set/model';
import { searchStickerSetsFx } from '@/features/catalog-search/api';
import { StickerSetSkeleton } from '@/shared/ui/sticker-set/skeleton/sticker-set-item';
import { scrollLoaderIntersected } from '@/shared/ui/sticker-set/model';
import { $hasMore } from '@/entities/search';
import { mainMenuVisibilityToggled } from '@/entities/menu/model';


export const Catalog = () => {
  const searchFxPending = useUnit(searchStickerSetsFx.pending);
  const stickerSetIds = useUnit($$stickerSetIds);
  const hasMore = useUnit($hasMore);
  const stickerSets = useUnit($stickerSets);

  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);

  const onScroll = (props: OnScrollParams) => {
    if (props.scrollTop < 40) {
      return mainMenuVisibilityToggled(true);
    }

    if (props.scrollTop % 5 !== 0) return;
    if (Math.abs(props.scrollTop - prevScrollTop) < 30) return;

    const scrollingDown = (props.scrollTop - prevScrollTop) < 0;

    mainMenuVisibilityToggled(scrollingDown);
    setPrevScrollTop(props.scrollTop);
  };

  const rowCount = hasMore
    ? stickerSetIds.length === 0 ? 5 : stickerSetIds.length + (stickerSetIds.length < 5 ? 10 : 1)
    : stickerSetIds.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = searchFxPending
    ? async () => {}
    : async () => { scrollLoaderIntersected(); };

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }: { index: number }) => !hasMore || index < stickerSetIds.length;

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    return isRowLoaded({ index })
      ? (
        <CatalogItem key={key} style={style}>
          {index === 0 && <div style={{ height: '40px' }}/> } {/* TODO */}
          <StickerSet index={index} stickerSetId={stickerSetIds[index]}/>
        </CatalogItem>
      )
      : (
        <CatalogItem key={key} style={style}>
          {index === 0 && <div style={{ height: '40px' }}/> } {/* TODO */}
          <StickerSetSkeleton />
        </CatalogItem>
      );
  };

  return (
    <CatalogList>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
        threshold={10}>
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={registerChild}
                    className="List"
                    autoHeight
                    onScroll={onScroll}
                    height={height}
                    width={width}
                    onRowsRendered={onRowsRendered}
                    rowCount={rowCount}
                    rowHeight={({ index }) => { // TODO
                      if (index === 0) return 250;
                      {if (stickerSets[index]) {
                        return stickerSets[index].description
                          ? 210
                          : 190;
                      } else {
                        return 210;
                      }}
                    }} rowRenderer={rowRenderer}
                    scrollTop={scrollTop} />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </CatalogList>
  );
};
