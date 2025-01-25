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

export type BackendList = Omit<NewList, "items"> & {
  id: string;
  items: Item[];
};

export type UpdatedList = Omit<NewList, "items"> & {
  id: string;
  items: (Item | NewItem)[];
};
