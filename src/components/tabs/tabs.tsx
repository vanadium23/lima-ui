import { createSignal, For, type JSX, mergeProps } from "solid-js";

import { Tab } from "../tab/tab.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./tabs.css";

export enum TabsTheme {
  Primary = "primary",
}

export enum TabsSize {
  Medium = "medium",
}

export type TabData = {
  ariaLabel: string;
  content: JSX.Element;
  disabled?: boolean;
};

type TabsProps = {
  theme?: TabsTheme;
  size?: TabsSize;
  tabs: TabData[];
  ariaLabel: string;
  defaultActiveIndex?: number;
};

export const Tabs = (props: Testable<TabsProps>) => {
  const mProps: Testable<Required<TabsProps>> = mergeProps(
    {
      theme: TabsTheme.Primary,
      size: TabsSize.Medium,
      defaultActiveIndex: 0,
    },
    props,
  );

  const [activeTabIndex, setActiveTabIndex] = createSignal(mProps.defaultActiveIndex);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <div class={`tabs tabs_${mProps.theme} tabs_${mProps.size}`}>
      <div role="tablist" class="tabs__tablist" aria-label={mProps.ariaLabel} data-test-id={mProps.testId}>
        <For each={mProps.tabs}>
          {(tabData, index) => (
            <Tab
              selected={activeTabIndex() === index()}
              disabled={tabData.disabled ? tabData.disabled : false}
              handleClick={() => handleTabClick(index())}
              testId={`${mProps.testId}-tab`}
              testSubId={index()}
            >
              {tabData.ariaLabel}
            </Tab>
          )}
        </For>
      </div>

      <For each={mProps.tabs}>
        {(tabData, index) => (
          <div
            role="tabpanel"
            aria-label={tabData.ariaLabel}
            class="tabs__tabpanel"
            classList={{
              tabs__tabpanel_hidden: activeTabIndex() !== index(),
            }}
            data-test-id={`${mProps.testId}-tabpanel`}
            data-test-sub-id={index()}
          >
            {tabData.content}
          </div>
        )}
      </For>
    </div>
  );
};
