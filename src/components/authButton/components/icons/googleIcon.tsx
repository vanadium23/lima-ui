import { mergeProps } from "solid-js";

import type { AuthButtonIconProps } from "../../authButton.tsx";

export const GoogleIcon = (props: AuthButtonIconProps) => {
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
        d="M36.3422 16.7358H34.9997V16.6666H19.9997V23.3333H29.4188C28.0447 27.2141 24.3522 30 19.9997 30C14.4772 30 9.99967 25.5225 9.99967 20C9.99967 14.4775 14.4772 9.99998 19.9997 9.99998C22.5488 9.99998 24.868 10.9616 26.6338 12.5325L31.348 7.81831C28.3713 5.04415 24.3897 3.33331 19.9997 3.33331C10.7955 3.33331 3.33301 10.7958 3.33301 20C3.33301 29.2041 10.7955 36.6666 19.9997 36.6666C29.2038 36.6666 36.6663 29.2041 36.6663 20C36.6663 18.8825 36.5513 17.7916 36.3422 16.7358Z"
        fill="#FBC02D"
      />
      <path
        class="authButtonIcon__corePath"
        d="M5.25488 12.2425L10.7307 16.2583C12.2124 12.59 15.8007 9.99998 19.9999 9.99998C22.549 9.99998 24.8682 10.9616 26.6341 12.5325L31.3482 7.81831C28.3715 5.04415 24.3899 3.33331 19.9999 3.33331C13.5982 3.33331 8.04655 6.94748 5.25488 12.2425Z"
        fill="#E53935"
      />
      <path
        class="authButtonIcon__corePath"
        d="M19.9996 36.6667C24.3046 36.6667 28.2163 35.0192 31.1738 32.34L26.0154 27.975C24.3421 29.2425 22.2621 30 19.9996 30C15.6646 30 11.9838 27.2359 10.5971 23.3784L5.16211 27.5659C7.92044 32.9634 13.5221 36.6667 19.9996 36.6667Z"
        fill="#4CAF50"
      />
      <path
        class="authButtonIcon__corePath"
        d="M36.3425 16.7359L36.3292 16.6667H35H20V23.3334H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9759L26.0158 27.9742L31.1742 32.3392C30.8092 32.6709 36.6667 28.3334 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7359Z"
        fill="#1565C0"
      />
    </svg>
  );
};
