import type { ComplexWorld } from "../../context/hooks.ts";
import { AUTO_LIST_ITEM, LIST_ITEM } from "../../testIds.ts";

export async function calculateCurrentItemsCount(complexWorld: ComplexWorld) {
  const listItems = complexWorld.locateByIdParts(LIST_ITEM);
  const autoItem = complexWorld.locateByIdParts(AUTO_LIST_ITEM);

  return (await listItems.count()) + (await autoItem.count());
}
