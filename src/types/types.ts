import type { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export type Item = {
  content: string;
  id: string;
  originalList: { id: string; name: string };
};

export type ItemFromBackend = Item;

export type SimpleList = {
  name: string;
  id: string;
};

export type ListBase = {
  id: string;
  name: string;
  purpose: string;
  exportedTo?: SimpleList[];
};

export type List = ListBase & {
  items: Item[];
  note: string;
};

export type ListFromBackend = List;

export type EditListItem = ItemFromBackend & {
  dragId: string;
  auto: boolean;
};

export type EditListList = List & {
  dragId: string;
};

export type DragList = ListBase & {
  items: EditListItem[];
  note: string;
};

export type ScrollContainer = HTMLDivElement | undefined;

export type Sortable = ReturnType<typeof createSortable>;

type RefDrag = Sortable["ref"];

export type DragSettings = {
  dragData: Sortable | null;
  dragProps:
    | {
        ref: RefDrag;
        style: JSX.CSSProperties;
      }
    | Record<string, never>;
  dragState: NonNullable<ReturnType<typeof useDragDropContext>>[0] | null;
};

// Переработанные типы

export type ListId = string;

export type ItemId = string;

type NewItemData = { content: string };

type UnchangedItemData = { id: ItemId };

type UpdatedItemData = { id: ItemId; content: string };

export type ItemData = NewItemData | UpdatedItemData | UnchangedItemData;

export type NewListData = {
  name: string;
  purpose: string;
  note: string;
  items: ItemData[];
};

export type UpdatedListData = NewListData & {
  id: ListId;
};
