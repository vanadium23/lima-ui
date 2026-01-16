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
      class="authButtonIcon"
      classList={{
        authButtonIcon_disabled: mProps.disabled,
      }}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="authButtonIcon__corePath"
        d="M3.40039 20C3.40039 10.795 10.8604 3.33331 20.0671 3.33331C29.2704 3.33331 36.7337 10.795 36.7337 20C36.7337 29.205 29.2704 36.6666 20.0671 36.6666C10.8604 36.6666 3.40039 29.205 3.40039 20Z"
        fill="#FC3F1D"
      />
      <path
        d="M22.2001 12.7766H20.6601C17.8367 12.7766 16.3517 14.2066 16.3517 16.315C16.3517 18.6983 17.3784 19.815 19.4867 21.2466L21.2284 22.42L16.2234 29.8983H12.4834L16.9751 23.2083C14.3917 21.3566 12.9417 19.5583 12.9417 16.5166C12.9417 12.7033 15.6001 10.1 20.6417 10.1H25.6467V29.88H22.2001V12.7766Z"
        fill="white"
      />
    </svg>
  );
};
