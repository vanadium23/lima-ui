import { createStore } from "solid-js/store";

import { REG_NETWORK_ERROR } from "../../../../../features/testIds.ts";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { AuthFormInput, AuthType } from "../../auth.tsx";
import { registerNewAccount } from "../../services/register.ts";

export type RegistrationFormInputsNames = "email" | "pass" | "repeat_pass" | "accept_agreement";
export type RegistrationFormInputs = Record<RegistrationFormInputsNames, AuthFormInput>;

export const initialRegistrationFormInputs: RegistrationFormInputs = {
  email: {
    value: "",
    isValid: true,
  },
  pass: {
    value: "",
    isValid: true,
  },
  repeat_pass: {
    value: "",
    isValid: true,
  },
  accept_agreement: {
    value: false,
    isValid: true,
  },
};

type RegistrationFormState = {
  inputs: RegistrationFormInputs;
  isLoading: boolean;
  authType: AuthType;
  isSuccessful: boolean;
};

export const [registrationFormStore, setRegistrationFormStore] = createStore<RegistrationFormState>({
  inputs: initialRegistrationFormInputs,
  isLoading: false,
  authType: "email",
  isSuccessful: false,
});

export function initRegistrationFormStore() {
  setRegistrationFormStore({
    inputs: initialRegistrationFormInputs,
    isLoading: false,
    authType: "email",
    isSuccessful: false,
  });
}

export function handleRegister(authType: AuthType) {
  setRegistrationFormStore("authType", authType);
  setRegistrationFormStore("isLoading", true);
  notificationState.clearNetworkErrors();
  registerNewAccount(
    {
      email: registrationFormStore.inputs.email.value.toString(),
      password: registrationFormStore.inputs.pass.value.toString(),
    },
    false,
  )
    .then((result) => {
      if (result) {
        setRegistrationFormStore("isSuccessful", true);
      }
    })
    .catch(() => {
      notificationState.pushNetworkError("Ошибка", "Нет соединения с сервером, попробуйте еще раз", REG_NETWORK_ERROR);
    })
    .finally(() => {
      setRegistrationFormStore("isLoading", false);
    });
}

export const handleChange = (inputName: RegistrationFormInputsNames) => (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    setRegistrationFormStore("inputs", inputName, "isValid", true);
    setRegistrationFormStore("inputs", inputName, "error", "");
    setRegistrationFormStore("inputs", inputName, "value", e.target.value);
  }
};

export const handleCheckboxChange = (value: boolean) => {
  setRegistrationFormStore("inputs", "accept_agreement", "isValid", true);
  setRegistrationFormStore("inputs", "accept_agreement", "error", "");
  setRegistrationFormStore("inputs", "accept_agreement", "value", value);
};
