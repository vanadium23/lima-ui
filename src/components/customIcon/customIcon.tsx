import { Match, mergeProps, Switch } from "solid-js";

import { IconSize } from "../icon/icon.tsx";

import { GoogleIcon } from "./icons/googleIcon.tsx";
import { VkIcon } from "./icons/vkIcon.tsx";
import { YandexIcon } from "./icons/yandexIcon.tsx";

const customIconNames = ["google", "yandex", "vk"] as const;
export type CustomIconName = (typeof customIconNames)[number];

export function isCustomIconName(x: string): x is CustomIconName {
  return (customIconNames as readonly string[]).indexOf(x) >= 0;
}

export type CustomIconInnerProps = {
  disabled?: boolean;
};

type CustomIconProps = {
  name: CustomIconName;
  size?: IconSize;
  disabled?: boolean;
};

export const CustomIcon = (props: CustomIconProps) => {
  const mProps: Required<CustomIconProps> = mergeProps(
    {
      size: IconSize.Medium,
      disabled: false,
    },
    props,
  );

  return (
    <div
      class="icon"
      classList={{
        [`icon_${mProps.size}`]: true,
      }}
    >
      <Switch fallback={null}>
        <Match when={mProps.name === "google"}>
          <GoogleIcon disabled={mProps.disabled} />
        </Match>
        <Match when={mProps.name === "yandex"}>
          <YandexIcon disabled={mProps.disabled} />
        </Match>
        <Match when={mProps.name === "vk"}>
          <VkIcon disabled={mProps.disabled} />
        </Match>
      </Switch>
    </div>
  );
};
