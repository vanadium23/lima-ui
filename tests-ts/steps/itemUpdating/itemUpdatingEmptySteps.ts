// Ported from features/item_updating/item_updating_empty_steps.clj
// — complete.
import { Then, type TestData } from "../../support/world.ts";
import { attemptToUpdateEssenceWithAnyCombinationOfUserProvidedFields } from "../../utilities/requestEssence.ts";
import { requestItemUpdate } from "../../utilities/requestItem.ts";
import { ITEM_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";

Then(
  "my attempt to update an item with any set of the same data fails",
  (svernikUpdateData: TestData): Promise<unknown> =>
    attemptToUpdateEssenceWithAnyCombinationOfUserProvidedFields(
      requestItemUpdate,
      ITEM_USER_PROVIDED_KEYWORDS,
      svernikUpdateData as {
        auth?: { sessionToken?: string };
        id: string;
        svernikData: Record<string, unknown>;
      },
    ),
);
