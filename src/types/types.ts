import type { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export type SimpleItem = {
  content: string;
  id: string;
};

export type Item = SimpleItem & {
  originalListId: string;
};

export type Items = Item[];

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
  items: Items;
  note: string;
};

export type DragItem = Item & {
  dragId: string;
  auto: boolean;
};

export type DragList = ListBase & {
  items: DragItem[];
  note: string;
};

export type ItemToSend = Item | { id: string } | { content: string };

export type NewList = {
  name: string;
  purpose: string;
  note: string;
  items: ItemToSend[];
};

export type UpdatedList = ListBase & {
  note: string;
  items: ItemToSend[];
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
