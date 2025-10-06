import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { getListLink } from "../../../utilities/addresses.ts";
import type { List } from "../../types/types.ts";
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
  disabled?: boolean;
  checkable?: boolean;
  children: List;
};

export const ImportedGroup = (props: Testable<ImportedGroupProps>) => {
  const mProps: Testable<Required<ImportedGroupProps>> = mergeProps(
    {
      theme: ImportedGroupTheme.Primary,
      size: ImportedGroupSize.Medium,
      disabled: false,
      checkable: false,
    },
    props,
  );

  return (
    <div
      class={`importedGroup importedGroup_${mProps.disabled ? "disabled" : mProps.theme} importedGroup_${mProps.size}`}
      classList={{
        importedGroup_checkable: mProps.checkable,
      }}
      data-test-id={mProps.testId}
    >
      <div class="importedGroup__dragHandle">
        <DragHandle disabled={mProps.disabled} testId={DEFAULT_TEST_ID} />
      </div>
      <div class="importedGroup__inner">
        <div class="importedGroup__headerWrapper">
          <div class="importedGroup__header">
            <Link
              size={LinkSize.Small}
              href={getListLink(mProps.children.id)}
              testId={DEFAULT_TEST_ID}
              disabled={mProps.disabled}
            >
              {mProps.children.name}
            </Link>
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
        <For each={mProps.children.items}>
          {(item) => (
            <ImportedItem
              testId={DEFAULT_TEST_ID}
              checkable={mProps.checkable}
              checked={false}
              disabled={mProps.disabled}
            >
              {item.content}
            </ImportedItem>
          )}
        </For>
      </div>
    </div>
  );
};
