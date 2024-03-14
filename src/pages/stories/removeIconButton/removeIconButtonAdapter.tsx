import { type Component } from "solid-js";
import { RemoveIconButton } from "../../../components/removeIconButton/removeIconButton.tsx";
import { DEFAULT_TEST_ID } from "../../../../features/testIds.ts";

export const RemoveIconButtonAdapter: Component = () => {
  return (
    <RemoveIconButton
      removeItem={() => {
        console.log("blet");
      }}
      onTimerStart={() => {
        console.log("timerStart-blet");
      }}
      onTimerCancel={() => {
        console.log("timerCancel-blet");
      }}
      isDisabled={false}
      testId={DEFAULT_TEST_ID}
    />
  );
};
