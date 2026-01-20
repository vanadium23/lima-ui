import { createStore } from "solid-js/store";

import { REG_NETWORK_ERROR } from "../../../../../features/testIds.ts";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { AuthFormInput } from "../../auth.tsx";
import { requestPasswordRestore } from "../../services/register.ts";

export type RestorePasswordFormInputsNames = "email";
export type RestorePasswordFormInputs = Record<RestorePasswordFormInputsNames, AuthFormInput>;

export const initialRestorePasswordFormInputs: RestorePasswordFormInputs = {
  email: {
    value: "",
    isValid: true,
  },
};

type RestorePasswordFormState = {
  inputs: RestorePasswordFormInputs;
  isLoading: boolean;
  isSuccessful: boolean;
};

export const [restorePasswordFormStore, setRestorePasswordFormStore] = createStore<RestorePasswordFormState>({
  inputs: initialRestorePasswordFormInputs,
  isLoading: false,
  isSuccessful: false,
});

export function initRestorePasswordFormStore() {
  setRestorePasswordFormStore({
    inputs: initialRestorePasswordFormInputs,
    isLoading: false,
    isSuccessful: false,
  });
}

export function handleRestorePassword() {
  setRestorePasswordFormStore("isLoading", true);
  notificationState.clearNetworkErrors();
  requestPasswordRestore(restorePasswordFormStore.inputs.email.value.toString(), false)
    .then((result) => {
      if (result) {
        setRestorePasswordFormStore("isSuccessful", true);
      }
    })
    .catch(() => {
      notificationState.pushNetworkError("Ошибка", "Нет соединения с сервером, попробуйте еще раз", REG_NETWORK_ERROR);
    })
    .finally(() => {
      setRestorePasswordFormStore("isLoading", false);
    });
}

export const handleChange = (inputName: RestorePasswordFormInputsNames) => (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    setRestorePasswordFormStore("inputs", inputName, "isValid", true);
    setRestorePasswordFormStore("inputs", inputName, "error", "");
    setRestorePasswordFormStore("inputs", inputName, "value", e.target.value);
  }
};
