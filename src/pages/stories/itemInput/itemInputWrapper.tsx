import { createSignal } from "solid-js";

import { DEFAULT_TEST_ID, OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON } from "../../../../features/testIds";
import { DropdownMenuWrapper } from "../../../components/dropdownMenuWrapper/dropdownMenuWrapper";
import { IconName } from "../../../components/icon/icon";
import { IconButtonSize } from "../../../components/iconButton/iconButton";
import { ItemInput } from "../../../components/itemInput/itemInput";

import { dropdownItems } from "./itemInputMenu";

export function ItemInputWrapper() {
  const [text, setText] = createSignal("");

  return (
    <ItemInput
      onChange={setText}
      textAreaValue={text()}
      maxLength={200}
      name="Some-text"
      isRequired={true}
      testId={DEFAULT_TEST_ID}
      placeholder="Введите текст"
      isDisabled={false}
      childComponent={(
        <DropdownMenuWrapper
          iconSize={IconButtonSize.MediumEmbedded}
          iconName={IconName.DotsThreeCircle}
          testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
          testSubId="0"
          dropDownMenuTestId={DEFAULT_TEST_ID}
          listOfButtons={dropdownItems()}
          isDisabled={false}
        />
      )}
    />
  );
}