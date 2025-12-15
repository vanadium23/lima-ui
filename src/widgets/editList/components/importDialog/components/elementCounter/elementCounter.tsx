import { mergeProps } from "solid-js";

import type { Testable } from "../../../../../../components/utilities/testable.ts";

import "./elementCounter.css";

export enum ElementCounterTheme {
  Primary = "primary",
}

export enum ElementCounterSize {
  Medium = "medium",
}

type ElementCounterProps = {
  theme?: ElementCounterTheme;
  size?: ElementCounterSize;
  isLimitReached: boolean;
  children: string | number;
  maxCount: number;
};

export const ElementCounter = (props: Testable<ElementCounterProps>) => {
  const mProps: Testable<Required<ElementCounterProps>> = mergeProps(
    {
      theme: ElementCounterTheme.Primary,
      size: ElementCounterSize.Medium,
    },
    props,
  );

  return (
    <div
      class="elementCounter"
      classList={{
        [`elementCounter_${mProps.size}`]: true,
        [`elementCounter_${mProps.theme}`]: true,
        elementCounter_limitReached: mProps.isLimitReached,
      }}
    >
      {`${mProps.children}/${mProps.maxCount}`}
    </div>
  );
};
