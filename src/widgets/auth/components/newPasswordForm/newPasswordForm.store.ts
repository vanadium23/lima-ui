import { createStore } from "solid-js/store";

import { REG_NETWORK_ERROR } from "../../../../../features/testIds.ts";
import { URL_MY_LISTS } from "../../../../../utilities/addresses.ts";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { AuthFormInput } from "../../auth.tsx";
import { requestPasswordChange } from "../../services/register.ts";

export type NewPasswordFormInputsNames = "pass" | "repeat_pass";
export type NewPasswordFormInputs = Record<NewPasswordFormInputsNames, AuthFormInput>;

export const initialNewPasswordFormInputs: NewPasswordFormInputs = {
  pass: {
    value: "",
    isValid: true,
  },
  repeat_pass: {
    value: "",
    isValid: true,
  },
};

type NewPasswordFormState = {
  inputs: NewPasswordFormInputs;
  isLoading: boolean;
};

export const [newPasswordFormStore, setNewPasswordFormStore] = createStore<NewPasswordFormState>({
  inputs: initialNewPasswordFormInputs,
  isLoading: false,
});

export function initNewPasswordFormStore() {
  setNewPasswordFormStore({
    inputs: initialNewPasswordFormInputs,
    isLoading: false,
  });
}

export function handleNewPassword(token: string) {
  setNewPasswordFormStore("isLoading", true);
  notificationState.clearNetworkErrors();
  requestPasswordChange(newPasswordFormStore.inputs.pass.value.toString(), token, false)
    .then((result) => {
      if (result) {
        window.location.replace(URL_MY_LISTS);
      }
    })
    .catch(() => {
      notificationState.pushNetworkError("Ошибка", "Нет соединения с сервером, попробуйте еще раз", REG_NETWORK_ERROR);
    })
    .finally(() => {
      setNewPasswordFormStore("isLoading", false);
    });
}

export const handleChange = (inputName: NewPasswordFormInputsNames) => (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    setNewPasswordFormStore("inputs", inputName, "isValid", true);
    setNewPasswordFormStore("inputs", inputName, "error", "");
    setNewPasswordFormStore("inputs", inputName, "value", e.target.value);
  }
};
