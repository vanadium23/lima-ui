import { createEffect, createSignal, Match, mergeProps, Switch, untrack } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./checkbox.css";

export enum CheckboxTheme {
  Primary = "primary",
}

export enum CheckboxSize {
  Small = "small",
  Medium = "medium",
}

export type CheckedState = true | false | "mixed";

type CheckboxProps = {
  theme?: CheckboxTheme;
  size?: CheckboxSize;
  isDisabled?: boolean;
  ariaLabel?: string | undefined;
  checked?: CheckedState;
  independent?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
};

export const Checkbox = (props: Testable<CheckboxProps>) => {
  const mProps: Testable<Required<CheckboxProps>> = mergeProps(
    {
      theme: CheckboxTheme.Primary,
      size: CheckboxSize.Medium,
      isDisabled: false,
      ariaLabel: undefined,
      checked: false,
      independent: true,
      onChange: () => {},
      name: "",
    },
    props,
  );

  const [getState, setState] = createSignal(untrack(() => mProps.checked));

  createEffect(() => {
    setState(mProps.checked);
  });

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const currentState = target.checked;

    setState(currentState);

    mProps.onChange(currentState);
  }

  // Здесь мы преобразовываем из трех значений true/false/"mixed"
  // в обычные true/false которые смогут принять нативные HTML-атрибуты
  function getCheckedState() {
    return getState() === true;
  }

  const iconSize = {
    [CheckboxSize.Small]: IconSize.ExtraSmall,
    [CheckboxSize.Medium]: IconSize.Medium,
  };

  return (
    <Switch>
      <Match when={mProps.independent}>
        <label
          class={`checkbox checkbox_${mProps.theme} checkbox_${mProps.size}`}
          classList={{
            checkbox_disabled: mProps.isDisabled,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <input
            type="checkbox"
            class="checkbox__input"
            disabled={mProps.isDisabled}
            checked={getCheckedState()}
            onChange={handleChange}
            aria-checked={getState()}
            aria-label={mProps.ariaLabel}
            name={mProps.name}
          />

          <span class="checkbox__inner">
            <span class="checkbox__icon">
              <Switch>
                <Match when={getState() === "mixed"}>
                  <Icon name={IconName.Minus} size={iconSize[mProps.size]} />
                </Match>
                <Match when={getState() === true}>
                  <Icon name={IconName.Check} size={iconSize[mProps.size]} />
                </Match>
              </Switch>
            </span>
          </span>
        </label>
      </Match>
      <Match when={!mProps.independent}>
        <span
          class={`checkbox checkbox_${mProps.theme} checkbox_${mProps.size} checkbox_independent`}
          classList={{
            checkbox_disabled: mProps.isDisabled,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <input
            type="checkbox"
            class="checkbox__input"
            disabled={mProps.isDisabled}
            checked={getCheckedState()}
            onChange={handleChange}
            aria-checked={getState()}
            aria-label={mProps.ariaLabel}
            name={mProps.name}
          />

          <span class="checkbox__inner">
            <span class="checkbox__icon">
              <Switch>
                <Match when={getState() === "mixed"}>
                  <Icon name={IconName.Minus} size={iconSize[mProps.size]} />
                </Match>
                <Match when={getState() === true}>
                  <Icon name={IconName.Check} size={iconSize[mProps.size]} />
                </Match>
              </Switch>
            </span>
          </span>
        </span>
      </Match>
    </Switch>
  );
};
