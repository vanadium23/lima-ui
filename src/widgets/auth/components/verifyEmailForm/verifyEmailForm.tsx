import { createEffect, createSignal, onMount, Show } from "solid-js";

import { URL_MY_LISTS } from "../../../../../utilities/addresses.ts";
import { verifyEmail } from "../../services/register.ts";

export const VerifyEmailForm = () => {
  const [isVerified, setIsVerified] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(() => {
    if (isVerified()) {
      window.location.replace(URL_MY_LISTS);
    }
  });

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setIsLoading(true);
      verifyEmail(token)
        .then((data) => {
          const authToken = data?.token;

          if (authToken) {
            localStorage.setItem("token", authToken);
          }
          setIsVerified(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsVerified(false);
          setIsLoading(false);
        });
    }
  });

  return (
    <div>
      <Show when={!isLoading() && !isVerified()}>
        <div>Email не подтвержден</div>
      </Show>
      <Show when={isLoading()}>
        <div>Идёт подтверждение email...</div>
      </Show>
    </div>
  );
};
