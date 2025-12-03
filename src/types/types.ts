import type { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export type ListId = string;

export type ListName = string;

export type ItemId = string;

export type ItemContent = string;

export type SimpleList = {
  name: ListName;
  id: ListId;
};

export type ItemFromBackend = {
  type: "item";
  id: ItemId;
  content: ItemContent;
  originalList: SimpleList;
  exportedTo: SimpleList[];
};

export type ImportedListFromBackend = {
  type: "list";
  id: ListId;
  name: ListName;
  purpose: string;
  note: string;
  items: ItemFromBackend[];
  exportedTo: SimpleList[];
};

export type ListElementFromBackend = ItemFromBackend | ImportedListFromBackend;

export type ListFromBackend = {
  type: "list";
  id: ListId;
  name: ListName;
  purpose: string;
  note: string;
  items: ListElementFromBackend[];
  exportedTo: SimpleList[] | null;
};

export type EditListItem = {
  type: "item";
  id: ItemId;
  content: ItemContent;
  originalList: SimpleList;
  dragId: string;
  auto: boolean;
};

export type EditListSimpleItem = {
  id: ItemId;
  content: ItemContent;
};

export type EditListElement = {
  id: ItemId | ListId;
  originalList: SimpleList;
  items: [EditListSimpleItem, ...EditListSimpleItem[]];
  isImported: boolean;
  exportedTo: SimpleList[];
  dragId: string;
  auto: boolean;
};

export type EditListType = {
  type: "list";
  id: ListId;
  name: ListName;
  purpose: string;
  note: string;
  elements: EditListElement[];
  exportedTo: SimpleList[];
};

type ImportedElementData = { id: ItemId };

type UnchangedItemData = { id: ItemId };

type UpdatedItemData = { id: ItemId; content: ItemContent };

type NewItemData = { content: ItemContent };

export type ItemData = NewItemData | UpdatedItemData | UnchangedItemData | ImportedElementData;

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
