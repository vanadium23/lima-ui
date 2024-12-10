import { type Component } from "solid-js";
import "./nav.css";
import { IconName } from "../icon/icon.tsx";
import { NavItem, NavItemSize, NavItemTheme } from "../navItem/navItem.tsx";

export const Nav: Component = () => {
  return (
    <nav class="nav">
      <ul class="nav__list" role="menubar" aria-label="Navigation">
        <li class="nav__item" role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Главная"
            icon={IconName.CircleNotch}
            isCurrent={true}
          />
        </li>
        <li role="none">
          <NavItem
            url="/lists/"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Мои списки"
            icon={IconName.CircleNotch}
          />
        </li>
        <li role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Избранное"
            icon={IconName.CircleNotch}
          />
        </li>
        <li role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Архив"
            icon={IconName.CircleNotch}
          />
        </li>
        <li role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Корзина"
            icon={IconName.CircleNotch}
          />
        </li>
        <li role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Помощь"
            icon={IconName.CircleNotch}
          />
        </li>
        <li role="none">
          <NavItem
            url="https://ya.ru"
            theme={NavItemTheme.Primary}
            size={NavItemSize.Large}
            text="Настройки"
            icon={IconName.CircleNotch}
          />
        </li>
      </ul>
    </nav>
  );
};
