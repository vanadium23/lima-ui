import { createSignal, mergeProps } from "solid-js";

import {
  DEFAULT_TEST_ID,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../../../features/testIds.ts";
import { DropdownMenuWrapper } from "../../../components/dropdownMenuWrapper/dropdownMenuWrapper.tsx";
import { IconName } from "../../../components/icon/icon.tsx";
import { IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import { ItemInput } from "../../../components/itemInput/itemInput.tsx";
import type { MenuItemProps } from "../../../components/menuItem/menuItem.tsx";

type ItemInputWrapperProps = {
  isError?: boolean;
  listOfButtons?: MenuItemProps[] | null;
};

export function ItemInputWrapper(props: ItemInputWrapperProps) {
  const mProps = mergeProps(
    {
      isError: false,
      listOfButtons: null,
    },
    props,
  );
  const [text, setText] = createSignal("");

  return (
    <ItemInput
      onChange={setText}
      textAreaValue={text()}
      maxLength={200}
      name="Some-text"
      isRequired={true}
      testId={DEFAULT_TEST_ID}
      defaultIsError={mProps.isError}
      placeholder="Введите текст"
      controlElements={
        mProps.listOfButtons ? (
          <DropdownMenuWrapper
            iconSize={IconButtonSize.MediumEmbedded}
            iconName={IconName.DotsThree}
            testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
            testSubId="0"
            dropDownMenuTestId={DEFAULT_TEST_ID}
            listOfButtons={mProps.listOfButtons}
            isDisabled={false}
          />
        ) : null
      }
    />
  );
}
