import { type Component } from "solid-js";
import { RemoveIconButton } from "../../../components/removeIconButton/removeIconButton.tsx";
import { DEFAULT_TEST_ID } from "../../../../features/testIds.ts";

export const RemoveIconButtonAdapter: Component = () => {
  return (
    <RemoveIconButton
      removeItem={() => {
        console.log("Удаление выполнено");
      }}
      onTimerStart={() => {
        console.log("Таймер запущен");
      }}
      onTimerCancel={() => {
        console.log("Таймер отменен");
      }}
      isDisabled={false}
      testId={DEFAULT_TEST_ID}
    />
  );
};
