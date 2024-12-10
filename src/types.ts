export type NewItem = {
  content: string;
};

export type NewList = {
  name: string;
  items: NewItem[];
  purpose: string;
  note: string;
};

export type Item = NewItem & {
  id: string;
};

export type BackendList = NewList & {
  id: string;
  items: Item[];
};

export type UpdatedList = NewList & {
  id: string;
  items: (Item | NewItem)[];
};
