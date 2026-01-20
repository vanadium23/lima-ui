import type { RestorePasswordFormInputs } from "../restorePasswordForm.store.ts";

export const isRestorePasswordFormValid = (inputs: RestorePasswordFormInputs) => {
  return Object.values(inputs).every((value) => value.isValid);
};

export const validateRestorePasswordForm = (inputs: RestorePasswordFormInputs) => {
  const { email } = inputs;

  const result: RestorePasswordFormInputs = {
    email,
  };

  return result;
};
