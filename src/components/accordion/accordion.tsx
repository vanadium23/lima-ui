import { type Component, createSignal, type JSX, mergeProps } from "solid-js";
import "./accordion.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

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

export const Accordion: Component<AccordionProps> = (props) => {
  const [getExpanded, setExpanded] = createSignal(false);

  const mProps: Required<AccordionProps> = mergeProps(
    {
      isDisabled: false,
      handleClick: () => {},
    },
    props,
  );

  const toggleExpanded = () => {
    setExpanded(!getExpanded());
  };

  const iconSize = {
    [AccordionSize.Small]: IconSize.x9,
    [AccordionSize.Medium]: IconSize.x11,
    [AccordionSize.Large]: IconSize.x12,
  };

  return (
    <div
      class={`accordion accordion_${mProps.theme} accordion_${mProps.size}`}
      classList={{
        accordion_disabled: mProps.isDisabled,
        accordion_expanded: getExpanded(),
      }}
    >
      <button
        type="button"
        class="accordion__header"
        aria-expanded={getExpanded()}
        onClick={toggleExpanded}
        disabled={mProps.isDisabled}
      >
        <div class="accordion__headerIcon">
          <Icon name={IconName.Chevron} size={iconSize[mProps.size]} />
        </div>
        <span class="accordion__title">{mProps.title}</span>
      </button>
      <div class="accordion__content">{mProps.children}</div>
    </div>
  );
};
