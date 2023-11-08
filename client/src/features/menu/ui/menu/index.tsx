import { useRef } from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import c from 'classnames';

import { MenuButtonProps } from '../types';

import styles from './menu.module.scss';

import { TabsScroller } from '@/features/menu/ui/tab-scroller';
import { useTabsScroller } from '@/features/menu/ui/tab-scroller/hooks/use-tab-scroller';
import { MENU_OPTIONS_ENUM } from '@/shared/constants';
import { $mainMenu, $mainMenuVisibility, setOption } from '@/entities/menu/model';


export const Menu = () => {
  const isOpen = useUnit($mainMenuVisibility);
  const menuOption = useUnit($mainMenu);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bounds = useTabsScroller(wrapperRef, menuOption);

  return (
    <div
      className={c([styles.Menu, isOpen && styles.isOpen])}
    >
      <TabsScroller bounds={bounds}/>
      <div
        className={styles.buttonsWrapper}
        ref={wrapperRef}
      >
        <MenuButton
          active={menuOption}
          onClick={setOption}
          menuOption={MENU_OPTIONS_ENUM.new}
        />
        <MenuButton
          active={menuOption}
          onClick={setOption}
          menuOption={MENU_OPTIONS_ENUM.verified}
        />
        <MenuButton
          active={menuOption}
          onClick={setOption}
          menuOption={MENU_OPTIONS_ENUM.trending}
        />
      </div>
    </div>
  );
};

const MenuButton = ({ active, menuOption, onClick }: MenuButtonProps) => {
  const { t } = useTranslation();

  return (
    <div
      data-menu-option={menuOption}
      onClick={() => onClick(menuOption)}
      className={c([styles.MenuButton, active === menuOption && styles.active])}>
      {t(`menu.${menuOption}`)}
    </div>
  );
};
