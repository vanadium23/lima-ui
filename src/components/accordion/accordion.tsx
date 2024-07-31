import { type Component, createSignal, type JSX, mergeProps } from "solid-js";
import "./accordion.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";
import {
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
} from "../../../features/testIds.ts";

export enum AccordionTheme {
  Primary = "primary",
}

export enum AccordionSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type AccordionProps = {
  isDisabled?: boolean;
  title: string;
  children: JSX.Element;
  theme: AccordionTheme;
  size: AccordionSize;
};

export const Accordion: Component<Testable<AccordionProps>> = (props) => {
  const [getExpanded, setExpanded] = createSignal(false);

  const mProps: Testable<Required<AccordionProps>> = mergeProps(
    {
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
        disabled={mProps.isDisabled}
        data-test-id={buildAccordionButtonTestId(mProps.testId)}
      >
        <div class="accordion__headerIcon">
          <Icon name={IconName.Chevron} size={iconSize[mProps.size]} />
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
