import { createSignal, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../../features/testIds";
import { ListItem } from "../../../components/listItem/listItem";

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

  const [text, setText] = createSignal("");
  const [isCheckable] = createSignal(mProps.staticIsCheckable);

  return (
    <ListItem
      isCheckable={isCheckable()}
      isChecked={false}
      name="Item"
      testId={DEFAULT_TEST_ID}
      canAddMore={true}
      defaultValue={text()}
      onChange={setText}
    />
  );
}
