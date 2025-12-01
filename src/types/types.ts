import type { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export type ListId = string;

export type ListName = string;

export type ItemId = string;

export type SimpleList = {
  name: ListName;
  id: ListId;
};

export type ItemFromBackend = {
  type: "item";
  id: ItemId;
  content: string;
  originalList: SimpleList;
};

export type ImportDialogItem = ItemFromBackend;

export type ListFromBackend = {
  type: "list";
  id: ListId;
  name: ListName;
  purpose: string;
  note: string;
  items: ItemFromBackend[];
  exportedTo: SimpleList[] | null;
};

export type ImportDialogList = ListFromBackend;

export type EditListItem = {
  type: "item";
  id: ItemId;
  content: string;
  originalList: SimpleList;
  dragId: string;
  auto: boolean;
};

export type EditList = {
  type: "list";
  id: ListId;
  name: ListName;
  purpose: string;
  note: string;
  items: EditListItem[];
  exportedTo: SimpleList[];
};

type NewItemData = { content: string };

type UnchangedItemData = { id: ItemId };

type UpdatedItemData = { id: ItemId; content: string };

export type ItemData = NewItemData | UpdatedItemData | UnchangedItemData;

export type NewListData = {
  name: ListName;
  purpose: string;
  note: string;
  items: ItemData[];
};

export type UpdatedListData = NewListData & {
  id: ListId;
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
