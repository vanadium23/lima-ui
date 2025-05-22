import type { ComplexWorld } from "../../context/hooks.ts";
import { LIST_ITEM } from "../../testIds.ts";

export async function calculateCurrentItemsCount(complexWorld: ComplexWorld) {
  return await complexWorld.locateByIdParts(LIST_ITEM).count();
}
