import { useStoreMap, useUnit } from 'effector-react';
import { useState } from 'react';
import { OnScrollParams, ListRowProps, InfiniteLoader, WindowScroller, AutoSizer, List } from 'react-virtualized';

import { mainMenuVisibilityToggled } from '@/entities/menu/model';
import { $hasMore } from '@/entities/search';
import { StickerSet } from '@/features/sticker-set';
import { CatalogItem, CatalogList } from '@/shared/ui';
import { StickerSetSkeleton } from '@/shared/ui/sticker-set/skeleton/sticker-set-item';
import { IStickerSet } from '@/types';
import { getRecommendationsFx, $recommendations } from '@/shared/recommendations';


export const ListRecommendationsWidget = ({ stickerSet }: { stickerSet: IStickerSet }) => {
  const searchFxPending = useUnit(getRecommendationsFx.pending);

  const recommendations = useStoreMap({
    store: $recommendations,
    keys: [stickerSet.id],
    fn: (recommendations, [id]) => {
      return recommendations[id] || [];
    },
  });

  const hasMore = useUnit($hasMore);

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
    ? recommendations.length === 0 ? 5 : recommendations.length + (recommendations.length < 5 ? 10 : 1)
    : recommendations.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = searchFxPending
    ? async () => {}
    : async () => { getRecommendationsFx([stickerSet.id]); };

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }: { index: number }) => !hasMore || index < recommendations.length;

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    return isRowLoaded({ index })
      ? (
        <CatalogItem key={key} style={style}>
          <StickerSet index={index} stickerSet={recommendations[index]}/>
        </CatalogItem>
      )
      : (
        <CatalogItem key={key} style={style}>
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
                      {if (recommendations[index]) {
                        return recommendations[index].description
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

