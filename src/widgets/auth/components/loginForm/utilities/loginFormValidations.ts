import type { LoginFormInputs } from "../loginForm.store.ts";

export const isLoginFormValid = (inputs: LoginFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateLoginForm = (inputs: LoginFormInputs) => {
  const { email, pass } = inputs;

  const emailInput = document.getElementsByName("Электронная почта").item(0) as HTMLInputElement;
  const isEmailValid = emailInput.checkValidity();

  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  const isPassValid = passRegex.test(pass.value.toString());

  const result: LoginFormInputs = {
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
  };

  return result;
};
