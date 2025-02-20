import { createSignal, type JSX, mergeProps } from "solid-js";

import {
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
} from "../../../features/testIds.ts";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./accordion.css";

export enum AccordionTheme {
  Primary = "primary",
}

export enum AccordionSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type AccordionProps = {
  theme?: AccordionTheme;
  size?: AccordionSize;
  isDisabled?: boolean;
  title: string;
  children: JSX.Element;
};

export const Accordion = (props: Testable<AccordionProps>) => {
  const [getExpanded, setExpanded] = createSignal(false);

  const mProps: Testable<Required<AccordionProps>> = mergeProps(
    {
      theme: AccordionTheme.Primary,
      size: AccordionSize.Medium,
      isDisabled: false,
    },
    props,
  );

  const toggleExpanded = () => {
    setExpanded(!getExpanded());
  };

  const iconSize = {
    [AccordionSize.Small]: IconSize.Small,
    [AccordionSize.Medium]: IconSize.Medium,
    [AccordionSize.Large]: IconSize.Large,
  };

  return (
    <div
      class={`accordion accordion_${mProps.theme} accordion_${mProps.size}`}
      classList={{
        accordion_disabled: mProps.isDisabled,
        accordion_expanded: getExpanded(),
      }}
      data-test-id={mProps.testId}
    >
      <button
        type="button"
        class="accordion__header"
        aria-expanded={getExpanded()}
        onClick={toggleExpanded}
        disabled={Boolean(mProps.isDisabled)}
        data-test-id={buildAccordionButtonTestId(mProps.testId)}
      >
        <div class="accordion__headerIcon">
          <Icon name={IconName.CaretDown} size={iconSize[mProps.size]} />
        </div>
        <span class="accordion__title">{mProps.title}</span>
      </button>
      <div
        class="accordion__content"
        data-test-id={buildAccordionContentTestId(mProps.testId)}
      >
        {mProps.children}
      </div>
    </div>
  );
};
