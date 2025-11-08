import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { type ItemInputMeaning, LIST_ITEM_INPUT_TEST_IDS } from "../list/listAddItems/testIds.ts";
import {
  DRAG_HANDLE_TEST_IDS,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON_TEST_IDS,
} from "../list/listItemsDragAndDrop/testIds.ts";
import { isMobile, isTablet } from "../utilities/discoverDevice.ts";
import { registerItem } from "../utilities/registerItem.ts";

enum Enablement {
  Enabled = "toBeEnabled",
  Disabled = "toBeDisabled",
}

enum Visibility {
  See = "toBeInViewport",
  Have = "toBeVisible",
}

Then(
  "I expect to see the {string} item input enabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    await verifyItemInputState(this, itemInputMeaning, Visibility.See, Enablement.Enabled);
  },
);

Then(
  "I expect to see the {string} item input disabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    await verifyItemInputState(this, itemInputMeaning, Visibility.See, Enablement.Disabled);
  },
);

Then(
  "I expect to have the {string} item input enabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    await verifyItemInputState(this, itemInputMeaning, Visibility.Have, Enablement.Enabled);
  },
);

Then(
  "I expect to have the {string} item input disabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    await verifyItemInputState(this, itemInputMeaning, Visibility.Have, Enablement.Disabled);
  },
);

async function verifyItemInputState(
  complexWorld: ComplexWorld,
  itemInputMeaning: ItemInputMeaning,
  visibility: Visibility,
  enablement: Enablement,
) {
  await registerItem(complexWorld, itemInputMeaning);

  const expectListItemInput = complexWorld.expectLocated(LIST_ITEM_INPUT_TEST_IDS[itemInputMeaning]);

  await expectListItemInput[visibility]();
  await expectListItemInput[enablement]();

  if (isTablet() || isMobile()) {
    const expectDragHandle = complexWorld.expectLocated(DRAG_HANDLE_TEST_IDS[itemInputMeaning]);
    await expectDragHandle[visibility]();
    await expectDragHandle[enablement]();

    const expectOpenContextMenuListItemButton = complexWorld.expectLocated(
      OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON_TEST_IDS[itemInputMeaning],
    );
    await expectOpenContextMenuListItemButton[visibility]();
    await expectOpenContextMenuListItemButton[enablement]();
  }
}
