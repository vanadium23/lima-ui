import { createSignal, mergeProps } from "solid-js";

import {
  DEFAULT_TEST_ID,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../../../features/testIds.ts";
import {
  CyberInput,
  CyberInputSize,
  CyberInputTheme,
} from "../../../components/cyberInput/cyberInput.tsx";
import { DropdownMenuWrapper } from "../../../components/dropdownMenuWrapper/dropdownMenuWrapper.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import type { MenuItemProps } from "../../../components/menuItem/menuItem.tsx";

type CyberInputWrapperProps = {
  size: CyberInputSize;
  theme: CyberInputTheme;
  isError?: boolean;
  listOfButtons?: MenuItemProps[] | null;
};

export function CyberInputWrapper(props: CyberInputWrapperProps) {
  const mProps = mergeProps(
    {
      isError: false,
      listOfButtons: null,
    },
    props,
  );
  const [text, setText] = createSignal("");

  return (
    <CyberInput
      onChange={setText}
      defaultValue={text()}
      size={mProps.size}
      theme={mProps.theme}
      maxLength={50}
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
