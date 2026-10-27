// Ported from features/svernik_updating/
// svernik_updating_recursive_references_steps.clj — complete.
import { But, type TestData } from "../../support/world.ts";
import { ID } from "../../../src-ts/domain/svernik.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import { fieldifyEssence } from "../../utilities/handleRawData.ts";

But("I provide a link to this very svernik", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: svernikData.id,
  }) as TestData);

But("I want to do the referenced svernik update", (svernikUpdateData: TestData): TestData => {
  const updatedSvernik = svernikUpdateData.preparedList as Record<string, unknown>;
  const items = (updatedSvernik.items ?? []) as Record<string, unknown>[];
  const innerSvernik = items[items.length - 1]!;
  return {
    id: innerSvernik.id,
    svernikData: {},
    essence: fieldifyEssence(innerSvernik),
    originalSvernikId: updatedSvernik.id,
    auth: svernikUpdateData.auth,
  };
});

But("I provide a link to the original svernik", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: svernikData.originalSvernikId,
  }) as TestData);
