import { createSignal, type JSX, Match, mergeProps, Switch } from "solid-js";

import { Icon, IconSize } from "../../components/icon/icon.tsx";
import { IconName } from "../../components/icon/types.ts";

import "./marketingAccordionQA.css";

export enum MarketingAccordionQATheme {
  Primary = "primary",
}

type MarketingAccordionQAProps = {
  theme?: MarketingAccordionQATheme;
  title: string;
  children: JSX.Element;
};

export const MarketingAccordionQA = (props: MarketingAccordionQAProps) => {
  const [getExpanded, setExpanded] = createSignal(false);

  const mProps: Required<MarketingAccordionQAProps> = mergeProps(
    {
      theme: MarketingAccordionQATheme.Primary,
      disabled: false,
    },
    props,
  );

  const toggleExpanded = () => {
    setExpanded(!getExpanded());
  };

  return (
    <div
      class="marketingAccordionQa"
      classList={{
        [`marketingAccordionQa_${mProps.theme}`]: true,
        marketingAccordionQa_expanded: getExpanded(),
      }}
    >
      <button type="button" class="marketingAccordionQa__header" aria-expanded={getExpanded()} onClick={toggleExpanded}>
        <span class="marketingAccordionQa__title">{mProps.title}</span>

        <Switch>
          <Match when={getExpanded()}>
            <div class="marketingAccordionQa__headerIcon">
              <Icon name={IconName.Minus} size={IconSize.ExtraLarge} />
            </div>
          </Match>
          <Match when={!getExpanded()}>
            <div class="marketingAccordionQa__headerIcon">
              <Icon name={IconName.Plus} size={IconSize.ExtraLarge} />
            </div>
          </Match>
        </Switch>
      </button>
      <div class="marketingAccordionQa__content">{mProps.children}</div>
    </div>
  );
};
