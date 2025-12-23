import { validatePassword } from "../../../../../../utilities/validatePassword.ts";
import type { NewPasswordFormInputs } from "../newPasswordForm.store.ts";

export const isNewPasswordFormValid = (inputs: NewPasswordFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateNewPasswordForm = (inputs: NewPasswordFormInputs) => {
  const { pass, repeat_pass } = inputs;

  const isPassValid = validatePassword(pass.value.toString());
  const isRepeatPassValid = !isPassValid || pass.value === repeat_pass.value;

  const result: NewPasswordFormInputs = {
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
  };

  return result;
};
