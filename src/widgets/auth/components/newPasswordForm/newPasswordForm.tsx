import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../../../../../configuration.ts";
import {
  NEW_PASSWORD_PASS_INPUT,
  NEW_PASSWORD_REPEAT_PASS_INPUT,
  NEW_PASSWORD_SUBMIT_BUTTON,
} from "../../../../../features/testIds.ts";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { FormField } from "../../../../components/formField/formField.tsx";
import { AutocompleteType, InputType } from "../../../../components/input/input.tsx";

import {
  handleChange,
  handleNewPassword,
  initNewPasswordFormStore,
  newPasswordFormStore,
  setNewPasswordFormStore,
} from "./newPasswordForm.store.ts";
import { isNewPasswordFormValid, validateNewPasswordForm } from "./utilities/newPasswordFormValidation.ts";
import "./newPasswordForm.css";

function onSubmit(e: SubmitEvent) {
  e.preventDefault();

  const validatedInputs = validateNewPasswordForm(newPasswordFormStore.inputs);
  setNewPasswordFormStore("inputs", validatedInputs);

  if (isNewPasswordFormValid(validatedInputs)) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      handleNewPassword(token);
    }
  }
}

export const NewPasswordForm = () => {
  initNewPasswordFormStore();

  return (
    <form class="newPasswordForm__wrapper" method="post" onSubmit={onSubmit}>
      <div class="newPasswordForm__title">Создание нового пароля</div>

      <div class="newPasswordForm__inputs">
        <FormField
          labelText="Пароль"
          hintText={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы [a-z] и цифры [0-9]`}
          errorText={newPasswordFormStore.inputs.pass.error}
          isError={!newPasswordFormStore.inputs.pass.isValid}
          type={InputType.Password}
          placeholder="Пароль"
          name="Пароль"
          maxLength={MAX_PASSWORD_LENGTH}
          testId={NEW_PASSWORD_PASS_INPUT}
          required={true}
          onInput={handleChange("pass")}
          disabled={newPasswordFormStore.isLoading}
          autocomplete={AutocompleteType.NewPassword}
        >
          {newPasswordFormStore.inputs.pass.value.toString()}
        </FormField>
        <FormField
          labelText="Повторите пароль"
          errorText={newPasswordFormStore.inputs.repeat_pass.error}
          isError={!newPasswordFormStore.inputs.repeat_pass.isValid}
          type={InputType.Password}
          placeholder="Пароль"
          name="Повторный пароль"
          maxLength={MAX_PASSWORD_LENGTH}
          testId={NEW_PASSWORD_REPEAT_PASS_INPUT}
          required={true}
          onInput={handleChange("repeat_pass")}
          disabled={newPasswordFormStore.isLoading}
          autocomplete={AutocompleteType.NewPassword}
        >
          {newPasswordFormStore.inputs.repeat_pass.value.toString()}
        </FormField>
        <Button testId={NEW_PASSWORD_SUBMIT_BUTTON} type={ButtonType.Submit} loading={newPasswordFormStore.isLoading}>
          Сбросить пароль
        </Button>
      </div>
    </form>
  );
};
