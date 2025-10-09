import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { getListLink } from "../../../utilities/addresses.ts";
import type { DragSettings, Item } from "../../types/types.ts";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize } from "../iconButton/iconButton.tsx";
import { ImportedItem } from "../importedItem/importedItem.tsx";
import { Link, LinkSize } from "../link/link.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./importedGroup.css";

export enum ImportedGroupTheme {
  Primary = "primary",
  Disabled = "disabled",
}

export enum ImportedGroupSize {
  Medium = "medium",
}

type ImportedGroupProps = {
  theme?: ImportedGroupTheme;
  size?: ImportedGroupSize;
  disabled?: boolean;
  isCheckable?: boolean;
  items: Item[];
  name?: string;
  id: string;
  dragSettings?: DragSettings;
  isDraggingOverlay?: boolean;
};

export const ImportedGroup = (props: Testable<ImportedGroupProps>) => {
  const mProps: Testable<Required<ImportedGroupProps>> = mergeProps(
    {
      theme: ImportedGroupTheme.Primary,
      size: ImportedGroupSize.Medium,
      disabled: false,
      isCheckable: false,
      dragSettings: {
        dragData: null,
        dragProps: {},
        dragState: null,
      },
      isDraggingOverlay: false,
      dragId: "",
      name: "Тест",
    },
    props,
  );

  return (
    <div
      {...mProps.dragSettings.dragProps}
      class={`importedGroup importedGroup_${mProps.disabled ? ImportedGroupTheme.Disabled : mProps.theme} importedGroup_${mProps.size}`}
      classList={{
        importedGroup_checkable: mProps.isCheckable,
      }}
      data-test-id={mProps.testId}
    >
      <div class="importedGroup__dragHandle">
        <DragHandle isDisabled={mProps.disabled} testId={DEFAULT_TEST_ID} dragHandle={mProps.dragSettings.dragData} />
      </div>
      <div class="importedGroup__inner">
        <div class="importedGroup__headerWrapper">
          <div class="importedGroup__header">
            <Link
              size={LinkSize.Small}
              link={getListLink(mProps.id)}
              text={"Тест"}
              testId={DEFAULT_TEST_ID}
              isDisabled={mProps.disabled}
            />
            <div class="importedGroup__button">
              <IconButton
                iconName={IconName.DotsThree}
                size={IconButtonSize.MediumEmbedded}
                ariaLabel={"Лейбл"}
                testId={DEFAULT_TEST_ID}
                isDisabled={mProps.disabled}
              />
            </div>
          </div>
        </div>
        <For each={mProps.items}>
          {(item) => (
            <ImportedItem
              testId={DEFAULT_TEST_ID}
              itemText={item.content}
              isCheckable={mProps.isCheckable}
              checked={false}
              disabled={mProps.disabled}
            />
          )}
        </For>
      </div>
    </div>
  );
};
