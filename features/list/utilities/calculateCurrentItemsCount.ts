import type { ComplexWorld } from "../../context/hooks.ts";
import { LIST_ITEM } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

export async function calculateCurrentItemsCount(complexWorld: ComplexWorld) {
  // The consequent waitForSelector is needed to wait for the list items to appear.
  // count() does not wait for the elements to appear.
  await complexWorld.page.waitForSelector(buildTestableSelector(LIST_ITEM));

  return await complexWorld.locateByIdParts(LIST_ITEM).count();
}
