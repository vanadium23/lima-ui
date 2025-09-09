import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize } from "../iconButton/iconButton.tsx";
import { ImportedItem } from "../importedItem/importedItem.tsx";
import { Link, LinkSize } from "../link/link.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./importedGroup.css";

export enum ImportedGroupTheme {
  Primary = "primary",
}

export enum ImportedGroupSize {
  Medium = "medium",
}

type ImportedGroupProps = {
  theme?: ImportedGroupTheme;
  size?: ImportedGroupSize;
  defaultValue?: string;
  isDisabled?: boolean;
  isCheckable?: boolean;
};

export const ImportedGroup = (props: Testable<ImportedGroupProps>) => {
  const mProps: Testable<Required<ImportedGroupProps>> = mergeProps(
    {
      theme: ImportedGroupTheme.Primary,
      size: ImportedGroupSize.Medium,
      defaultValue: "",
      isDisabled: false,
      isCheckable: false,
    },
    props,
  );

  return (
    <div
      class={`importedGroup importedGroup_${mProps.theme} importedGroup_${mProps.size}`}
      classList={{
        importedGroup_checkable: mProps.isCheckable,
        importedGroup_disabled: mProps.isDisabled,
      }}
      data-test-id={mProps.testId}
    >
      <div class="importedGroup__dragHandle">
        <DragHandle isDisabled={mProps.isDisabled} testId={DEFAULT_TEST_ID} />
      </div>
      <div class="importedGroup__inner">
        <div class="importedGroup__headerWrapper">
          <div class="importedGroup__header">
            <Link
              size={LinkSize.Small}
              link={"ya.ru"}
              text={"Link to list"}
              testId={DEFAULT_TEST_ID}
              isDisabled={mProps.isDisabled}
            />
            <div class="importedGroup__button">
              <IconButton
                iconName={IconName.DotsThree}
                size={IconButtonSize.MediumEmbedded}
                ariaLabel={"Лейбл"}
                testId={DEFAULT_TEST_ID}
                isDisabled={mProps.isDisabled}
              />
            </div>
          </div>
        </div>
        <For
          each={[
            { id: "1", content: "Тестовый пункт 1" },
            { id: "2", content: "Тестовый пункт 2" },
            { id: "3", content: "Тестовый пункт 3" },
            { id: "4", content: "Длинный тестовый пункт для проверки отображения" },
          ]}
        >
          {(item) => (
            <ImportedItem
              testId={DEFAULT_TEST_ID}
              itemText={item.content}
              isCheckable={mProps.isCheckable}
              isChecked={false}
              isDisabled={mProps.isDisabled}
            />
          )}
        </For>
      </div>
    </div>
  );
};
