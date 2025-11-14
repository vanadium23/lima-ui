import { REG_EMAIL_INPUT } from "../../../../features/testIds.ts";

import type { RegistrationFormInputs } from "./registrationForm.model.ts";

export const isRegistrationFormValid = (inputs: RegistrationFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateRegistrationForm = (inputs: RegistrationFormInputs) => {
  const { email, pass, repeat_pass, accept_police } = inputs;

  const emailInput = document.getElementsByName(REG_EMAIL_INPUT).item(0) as HTMLInputElement;
  const isEmailValid = emailInput.checkValidity();

  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  const isPassValid = passRegex.test(pass.value.toString());
  const isRepeatPassValid = !isPassValid || pass.value === repeat_pass.value;
  const isAcceptPoliceValid = Boolean(accept_police.value);

  const result: RegistrationFormInputs = {
    email: {
      ...email,
      isValid: isEmailValid,
      error: !isEmailValid ? "Неверный формат" : "",
    },
    pass: {
      ...pass,
      isValid: isPassValid,
      error: !isPassValid ? "Неверный формат" : "",
    },
    repeat_pass: {
      ...repeat_pass,
      isValid: isRepeatPassValid,
      error: !isRepeatPassValid ? "Пароли не совпадают" : "",
    },
    accept_police: {
      ...accept_police,
      isValid: isAcceptPoliceValid,
      error: !isAcceptPoliceValid ? "Необходимо принять пользовательское соглашение" : "",
    },
  };

  return result;
};
