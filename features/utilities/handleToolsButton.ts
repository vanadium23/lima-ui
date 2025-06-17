import type { ComplexWorld } from "../context/hooks.ts";
import { TOGGLE_TOOLS_PANEL_BUTTON, TOOLS_PANEL } from "../testIds.ts";
import { isMobile } from "./discoverDevice.ts";

export async function openToolsPanelForMobile(complexWorld: ComplexWorld) {
  if (isMobile() && !(await isToolsPanelVisible(complexWorld))) {
    await toggleToolsPanel(complexWorld);
  }
}

export async function closeToolsPanelForMobile(complexWorld: ComplexWorld) {
  if (isMobile() && (await isToolsPanelVisible(complexWorld))) {
    await toggleToolsPanel(complexWorld);
  }
}

async function isToolsPanelVisible(complexWorld: ComplexWorld) {
  return await complexWorld.locateByIdParts(TOOLS_PANEL).isVisible();
}

async function toggleToolsPanel(complexWorld: ComplexWorld) {
  await complexWorld.locateByIdParts(TOGGLE_TOOLS_PANEL_BUTTON).click();
}
