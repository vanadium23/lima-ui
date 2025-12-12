import { validatePassword } from "../../../../../../utilities/validatePassword.ts";
import type { RegistrationFormInputs } from "../registrationForm.store.ts";

export const isRegistrationFormValid = (inputs: RegistrationFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateRegistrationForm = (inputs: RegistrationFormInputs) => {
  const { email, pass, repeat_pass, accept_agreement } = inputs;

  const isPassValid = validatePassword(pass.value.toString());
  const isRepeatPassValid = !isPassValid || pass.value === repeat_pass.value;
  const isAcceptPoliceValid = Boolean(accept_agreement.value);

  const result: RegistrationFormInputs = {
    email,
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
    accept_agreement: {
      ...accept_agreement,
      isValid: isAcceptPoliceValid,
      error: !isAcceptPoliceValid ? "Необходимо принять пользовательское соглашение" : "",
    },
  };

  return result;
};
