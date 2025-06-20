import type { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export type Item = {
  content: string;
  id: string;
};

export type Items = Item[];

export type List = {
  items: Items;
  id: string;
  name: string;
  purpose: string;
  note: string;
};

export type DragItem = {
  dragId: string;
  content: string;
  id: string;
  auto: boolean;
};

export type DragItems = DragItem[];

export type DragList = {
  items: DragItems;
  id: string;
  name: string;
  purpose: string;
  note: string;
};

export type ItemToSend = Item | { id: string } | { content: string };

export type NewList = {
  name: string;
  purpose: string;
  note: string;
  items: ItemToSend[];
};

export type UpdatedList = {
  id: string;
  name: string;
  purpose: string;
  note: string;
  items: ItemToSend[];
};

export type ScrollContainer = HTMLDivElement | undefined;

export type ComparableList = {
  items: string;
  name: string;
  purpose: string;
  note: string;
};

export type EditListStore = DragList & {
  initialList: List;
  sendingNow: false | "saving" | "deleting";
  error: boolean;
  removeError: boolean;
  isCheckable: boolean;
  isDialogOpen: boolean;
  isChanged: boolean;
  isNewList: boolean;
  draggedItem: string;
  itemsScrollStartPosition: number;
};

export enum EditListFormNames {
  ListTitle = "List Title",
  ListPurpose = "List Purpose",
  ListNote = "List Note",
  ListItem = "List Item",
}

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
