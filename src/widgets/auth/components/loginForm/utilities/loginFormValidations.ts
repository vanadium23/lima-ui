import { validatePassword } from "../../../../../../utilities/validatePassword.ts";
import type { LoginFormInputs } from "../loginForm.store.ts";

export const isLoginFormValid = (inputs: LoginFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateLoginForm = (inputs: LoginFormInputs) => {
  const { email, pass } = inputs;

  const isPassValid = validatePassword(pass.value.toString());

  const result: LoginFormInputs = {
    email,
    pass: {
      ...pass,
      isValid: isPassValid,
      error: !isPassValid ? "Неверный формат" : "",
    },
  };

  return result;
};
