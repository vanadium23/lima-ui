import { mergeProps } from "solid-js";

import type { AuthButtonIconProps } from "../../authButton.tsx";

export const YandexIcon = (props: AuthButtonIconProps) => {
  const mProps: Required<AuthButtonIconProps> = mergeProps(
    {
      disabled: false,
    },
    props,
  );

  return (
    <svg
      width="20"
      height="20"
      class="authButtonIcon"
      classList={{
        authButtonIcon_disabled: mProps.disabled,
      }}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="authButtonIcon__corePath"
        d="M1.7002 10C1.7002 5.39751 5.4302 1.66667 10.0335 1.66667C14.6352 1.66667 18.3669 5.39751 18.3669 10C18.3669 14.6025 14.6352 18.3333 10.0335 18.3333C5.4302 18.3333 1.7002 14.6025 1.7002 10Z"
        fill="#FC3F1D"
      />
      <path
        d="M11.1 6.38834H10.33C8.91837 6.38834 8.17587 7.10334 8.17587 8.1575C8.17587 9.34917 8.6892 9.9075 9.74337 10.6233L10.6142 11.21L8.1117 14.9492H6.2417L8.48753 11.6042C7.19587 10.6783 6.47087 9.77917 6.47087 8.25834C6.47087 6.35167 7.80003 5.05 10.3209 5.05H12.8234V14.94H11.1V6.38834Z"
        fill="white"
      />
    </svg>
  );
};
