import { ListItem } from "../../../components/listItem/listItem.tsx";

export function ListItemWrapper() {
  return (
    <ListItem index={1} checked={false} name="Item">
      Тест
    </ListItem>
  );
}
