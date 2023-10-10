import { MENU_OPTIONS_ENUM } from '@/shared/constants';


export interface TabsScrollerProps {
  bounds: {
    left: number;
    width: number;
  }
}

export interface MenuButtonProps {
  active: MENU_OPTIONS_ENUM | null;
  onClick: (menuOption: MENU_OPTIONS_ENUM) => void;
  menuOption: MENU_OPTIONS_ENUM;
}
