import { createStore } from "solid-js/store";

import {
  REG_ACCEPT_POLICE,
  REG_EMAIL_INPUT,
  REG_NETWORK_ERROR,
  REG_PASS_INPUT,
  REG_REPEAT_PASS_INPUT,
} from "../../../../features/testIds.ts";
import { notificationState } from "../../../state/pushNotificationStateManager.ts";
import type { AuthType } from "../auth.model.ts";
import { registerNewAccount } from "../services/register.ts";

import { initialRegistrationFormInputs, type RegistrationFormInputs } from "./registrationForm.model.ts";

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

export const handleChange = (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    const name = e.target.getAttribute("name");
    let inputName = "";

    switch (name) {
      case REG_EMAIL_INPUT:
        inputName = "email";
        break;
      case REG_PASS_INPUT:
        inputName = "pass";
        break;
      case REG_REPEAT_PASS_INPUT:
        inputName = "repeat_pass";
        break;
      case REG_ACCEPT_POLICE:
        inputName = "accept_police";
    }

    if (inputName) {
      setRegistrationFormStore("inputs", inputName as keyof RegistrationFormInputs, "isValid", true);
      setRegistrationFormStore("inputs", inputName as keyof RegistrationFormInputs, "error", "");
      setRegistrationFormStore("inputs", inputName as keyof RegistrationFormInputs, "value", e.target.value);
    }
  }
};

export const handleCheckboxChange = (value: boolean) => {
  setRegistrationFormStore("inputs", "accept_police", "isValid", true);
  setRegistrationFormStore("inputs", "accept_police", "error", "");
  setRegistrationFormStore("inputs", "accept_police", "value", value);
};
