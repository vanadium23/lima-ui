import { createStore } from "solid-js/store";

import { REG_NETWORK_ERROR } from "../../../../../features/testIds.ts";
import { URL_MY_LISTS } from "../../../../../utilities/addresses.ts";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { AuthFormInput, AuthType } from "../../auth.tsx";
import { loginToAccount } from "../../services/register.ts";

export type LoginFormInputsNames = "email" | "pass";
export type LoginFormInputs = Record<LoginFormInputsNames, AuthFormInput>;

export const initialLoginFormInputs: LoginFormInputs = {
  email: {
    value: "",
    isValid: true,
  },
  pass: {
    value: "",
    isValid: true,
  },
};

type LoginFormState = {
  inputs: LoginFormInputs;
  isLoading: boolean;
  authType: AuthType;
  isSuccessful: boolean;
};

export const [loginFormStore, setLoginFormStore] = createStore<LoginFormState>({
  inputs: initialLoginFormInputs,
  isLoading: false,
  authType: "email",
  isSuccessful: false,
});

export function initLoginFormStore() {
  setLoginFormStore({
    inputs: initialLoginFormInputs,
    isLoading: false,
    authType: "email",
    isSuccessful: false,
  });
}

export function handleLogin(authType: AuthType) {
  setLoginFormStore("authType", authType);
  setLoginFormStore("isLoading", true);
  notificationState.clearNetworkErrors();
  loginToAccount(
    {
      email: loginFormStore.inputs.email.value.toString(),
      password: loginFormStore.inputs.pass.value.toString(),
    },
    false,
  )
    .then((result) => {
      if (result) {
        window.location.replace(URL_MY_LISTS);
      }
    })
    .catch(() => {
      setLoginFormStore("isLoading", false);
      notificationState.pushNetworkError("Ошибка", "Нет соединения с сервером, попробуйте еще раз", REG_NETWORK_ERROR);
    });
}

export const handleChange = (inputName: LoginFormInputsNames) => (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    setLoginFormStore("inputs", inputName, "isValid", true);
    setLoginFormStore("inputs", inputName, "error", "");
    setLoginFormStore("inputs", inputName, "value", e.target.value);
  }
};
