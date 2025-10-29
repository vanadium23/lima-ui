import { createSignal, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../../features/testIds.ts";
import { ListItem } from "../../../components/listItem/listItem.tsx";

type ListItemWrapperProps = {
  staticIsCheckable?: boolean;
};

export function ListItemWrapper(props: ListItemWrapperProps) {
  const mProps: Required<ListItemWrapperProps> = mergeProps(
    {
      staticIsCheckable: false,
    },
    props,
  );
  const [isCheckable] = createSignal(mProps.staticIsCheckable);

  return (
    <ListItem
      index={1}
      checkable={isCheckable()}
      checked={false}
      name="Item"
      testId={DEFAULT_TEST_ID}
      canAddMore={true}
    >
      Тест
    </ListItem>
  );
}
