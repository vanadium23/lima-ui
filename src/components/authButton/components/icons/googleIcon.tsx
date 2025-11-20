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
      xmlns="http://www.w3.org/2000/svg"
      class="authButtonIcon"
      classList={{
        authButtonIcon_disabled: mProps.disabled,
      }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        class="authButtonIcon__corePath"
        d="M18.1711 8.36792H17.4998V8.33334H9.99984V11.6667H14.7094C14.0223 13.6071 12.1761 15 9.99984 15C7.23859 15 4.99984 12.7613 4.99984 10C4.99984 7.23875 7.23859 5 9.99984 5C11.2744 5 12.434 5.48084 13.3169 6.26625L15.674 3.90917C14.1857 2.52209 12.1948 1.66667 9.99984 1.66667C5.39775 1.66667 1.6665 5.39792 1.6665 10C1.6665 14.6021 5.39775 18.3333 9.99984 18.3333C14.6019 18.3333 18.3332 14.6021 18.3332 10C18.3332 9.44125 18.2757 8.89584 18.1711 8.36792Z"
        fill="#FBC02D"
      />
      <path
        class="authButtonIcon__corePath"
        d="M2.62744 6.12126L5.36536 8.12917C6.10619 6.29501 7.90036 5.00001 9.99994 5.00001C11.2745 5.00001 12.4341 5.48084 13.317 6.26625L15.6741 3.90917C14.1858 2.52209 12.1949 1.66667 9.99994 1.66667C6.79911 1.66667 4.02327 3.47376 2.62744 6.12126Z"
        fill="#E53935"
      />
      <path
        class="authButtonIcon__corePath"
        d="M9.9998 18.3333C12.1523 18.3333 14.1081 17.5096 15.5869 16.17L13.0077 13.9875C12.1711 14.6212 11.1311 15 9.9998 15C7.8323 15 5.99189 13.6179 5.29855 11.6892L2.58105 13.7829C3.96022 16.4817 6.76105 18.3333 9.9998 18.3333Z"
        fill="#4CAF50"
      />
      <path
        class="authButtonIcon__corePath"
        d="M18.1712 8.36791L18.1646 8.33333H17.5H10V11.6667H14.7096C14.3796 12.5987 13.78 13.4025 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3333 14.1667 18.3333 9.99999C18.3333 9.44124 18.2758 8.89583 18.1712 8.36791Z"
        fill="#1565C0"
      />
    </svg>
  );
};
