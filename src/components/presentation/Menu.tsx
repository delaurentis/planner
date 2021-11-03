import React from 'react';
import styles from './Menu.module.css';

interface MenuItemProps {
  item: string;
  onClick(): void;
}

interface MenuProps {
  items: string[];
  onClickItem(item: string): void;
  isWide?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
  return (
    <div className={styles.MenuItem} onClick={() => props.onClick?.()}>
      {props.item}
    </div>
  );
}

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  return (
    <div className={styles.Menu} { ...{ wide: `${props.isWide || false}` }}>
      { props.items?.map(item => <MenuItem key={item} item={item} onClick={() => props.onClickItem?.(item)}/>) }
    </div>
  );
}

export default Menu;