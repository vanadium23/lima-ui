import { createStore } from "solid-js/store";

import { REG_NETWORK_ERROR } from "../../../../../features/testIds.ts";
import { REDIRECT_TO_PARAM, URL_MY_LISTS } from "../../../../../utilities/addresses.ts";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { AuthFormInput, AuthType } from "../../auth.tsx";
import { LOGIN_ERROR_WRONG_CREDENTIALS, LoginError, loginToAccount } from "../../services/login.ts";

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
  isRestorePasswordMode: boolean;
};

export const [loginFormStore, setLoginFormStore] = createStore<LoginFormState>({
  inputs: initialLoginFormInputs,
  isLoading: false,
  authType: "email",
  isSuccessful: false,
  isRestorePasswordMode: false,
});

export function initLoginFormStore() {
  setLoginFormStore({
    inputs: initialLoginFormInputs,
    isLoading: false,
    authType: "email",
    isSuccessful: false,
    isRestorePasswordMode: false,
  });
}

export function enableRestorePasswordMode() {
  setLoginFormStore("isRestorePasswordMode", true);
}

export function disableRestorePasswordMode() {
  setLoginFormStore("isRestorePasswordMode", false);
}

export function handleLogin(authType: AuthType) {
  setLoginFormStore("authType", authType);
  setLoginFormStore("isLoading", true);
  notificationState.clearNetworkErrors();
  loginToAccount({
    email: loginFormStore.inputs.email.value.toString(),
    password: loginFormStore.inputs.pass.value.toString(),
  })
    .then(() => {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get(REDIRECT_TO_PARAM);

      //DOC: Редирект на URL после успешной авторизации, на который пользователь хотел перейти изначально.
      window.location.replace(redirectTo ?? URL_MY_LISTS);
    })
    .catch((error: unknown) => {
      setLoginFormStore("isLoading", false);

      if (error instanceof LoginError && error.code === LOGIN_ERROR_WRONG_CREDENTIALS) {
        setLoginFormStore("inputs", "email", "isValid", false);
        setLoginFormStore("inputs", "email", "error", "Неверный адрес почты или пароль");

        return;
      }

      notificationState.pushNetworkError("Ошибка", "Нет соединения с сервером, попробуйте еще раз", REG_NETWORK_ERROR);
    });
}

export const handleLoginInputChange = (inputName: LoginFormInputsNames) => (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    setLoginFormStore("inputs", inputName, "isValid", true);
    setLoginFormStore("inputs", inputName, "error", "");
    setLoginFormStore("inputs", inputName, "value", e.target.value);
  }
};
