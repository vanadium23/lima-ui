import { createSignal, type JSX, mergeProps } from "solid-js";

import { buildAccordionButtonTestId, buildAccordionContentTestId } from "../../../features/testIds.ts";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./accordion.css";

export enum AccordionTheme {
  Primary = "primary",
}

export enum AccordionSize {
  Medium = "medium",
}

type AccordionProps = {
  theme?: AccordionTheme;
  size?: AccordionSize;
  disabled?: boolean;
  title: string;
  children: JSX.Element;
};

export const Accordion = (props: Testable<AccordionProps>) => {
  const [getExpanded, setExpanded] = createSignal(false);

  const mProps: Testable<Required<AccordionProps>> = mergeProps(
    {
      theme: AccordionTheme.Primary,
      size: AccordionSize.Medium,
      disabled: false,
    },
    props,
  );

  const toggleExpanded = () => {
    setExpanded(!getExpanded());
  };

  const iconSize = {
    [AccordionSize.Medium]: IconSize.Medium,
  };

  return (
    <div
      class="accordion"
      classList={{
        [`accordion_${mProps.size}`]: true,
        [`accordion_${mProps.theme}`]: !mProps.disabled,
        accordion_disabled: mProps.disabled,
        accordion_expanded: getExpanded(),
      }}
      data-test-id={mProps.testId}
    >
      <button
        type="button"
        class="accordion__header"
        aria-expanded={getExpanded()}
        onClick={toggleExpanded}
        disabled={Boolean(mProps.disabled)}
        data-test-id={buildAccordionButtonTestId(mProps.testId)}
      >
        <div class="accordion__headerIcon">
          <Icon name={IconName.CaretDown} size={iconSize[mProps.size]} />
        </div>
        <span class="accordion__title">{mProps.title}</span>
      </button>
      <div class="accordion__content" data-test-id={buildAccordionContentTestId(mProps.testId)}>
        {mProps.children}
      </div>
    </div>
  );
};
