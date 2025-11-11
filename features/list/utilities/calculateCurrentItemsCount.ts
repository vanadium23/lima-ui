import { URL_CREATE_LIST } from "../../../utilities/addresses.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import { LIST_ITEM } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

export async function calculateCurrentItemsCount(complexWorld: ComplexWorld) {
  const currentUrl = complexWorld.page.url();
  const isCreateListPage = currentUrl.includes(URL_CREATE_LIST);

  // SolidJS не успевает обновить DOM, и потому для страницы уже созданного списка нужно подождать.
  // А на странице создания списка если отдельные пункты и добавлены, то это сделано заблаговременно,
  // и их видно.
  if (!isCreateListPage) {
    await complexWorld.page.waitForSelector(buildTestableSelector(LIST_ITEM));
  }

  return await complexWorld.locateByIdParts(LIST_ITEM).count();
}
