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
  tabName: string;
  content: JSX.Element;
  disabled?: boolean;
};

type TabsProps = {
  theme?: TabsTheme;
  size?: TabsSize;
  tabs: TabData[];
  isEqualWidth?: boolean;
  ariaLabel: string;
  activeTab?: number;
  onSwitchActiveTab?: ((index: number) => void) | undefined;
};

export const Tabs = (props: Testable<TabsProps>) => {
  const mProps: Testable<Required<TabsProps>> = mergeProps(
    {
      theme: TabsTheme.Primary,
      size: TabsSize.Medium,
      activeTab: 0,
      onSwitchActiveTab: undefined,
      isEqualWidth: false,
    },
    props,
  );

  const [activeTabIndex, setActiveTabIndex] = createSignal(mProps.activeTab);

  const isControlled = Boolean(mProps.onSwitchActiveTab);

  const handleTabClick = (index: number) => {
    if (isControlled && mProps.onSwitchActiveTab) {
      mProps.onSwitchActiveTab(index);
    } else {
      setActiveTabIndex(index);
    }
  };

  return (
    <div
      class="tabs"
      classList={{
        [`tabs_${mProps.size}`]: true,
        [`tabs_${mProps.theme}`]: true,
        tabs_equalWidth: mProps.isEqualWidth,
      }}
    >
      <div role="tablist" class="tabs__tablist" aria-label={mProps.ariaLabel} data-test-id={mProps.testId}>
        <For each={mProps.tabs}>
          {(tabData, index) => (
            <Tab
              selected={isControlled ? mProps.activeTab === index() : activeTabIndex() === index()}
              disabled={tabData.disabled || false}
              handleClick={() => handleTabClick(index())}
              testId={`${mProps.testId}-tab`}
              testSubId={index()}
            >
              {tabData.tabName}
            </Tab>
          )}
        </For>
      </div>

      <For each={mProps.tabs}>
        {(tabData, index) => (
          <div
            role="tabpanel"
            aria-label={tabData.tabName}
            class="tabs__tabpanel"
            classList={{
              tabs__tabpanel_hidden: isControlled ? mProps.activeTab !== index() : activeTabIndex() !== index(),
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
