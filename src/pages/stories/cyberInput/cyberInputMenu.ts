import { IconName } from "../../../components/icon/types.ts";
import { MenuItemTheme } from "../../../components/menuItem/menuItem.tsx";

export const dropdownItems = () => [
  {
    text: "Добавить пункт выше",
    icon: IconName.Plus,
  },
  {
    text: "Добавить пункт ниже",
    icon: IconName.Plus,
  },
  {
    text: "Импортировать пункт выше",
    icon: IconName.SortDescending,
  },
  {
    text: "Импортировать пункт ниже",
    icon: IconName.SortAscending,
  },
  {
    text: "Удалить пункт",
    icon: IconName.Trash,
    theme: MenuItemTheme.Dangerous,
  },
];
