import { Match, Switch } from "solid-js";

import { MAX_EMAIL_LENGTH } from "../../../../../configuration.ts";
import {
  RESTORE_PASS_BACK_TO_LOGIN_LINK,
  RESTORE_PASS_EMAIL_INPUT,
  RESTORE_PASS_SUBMIT_BUTTON,
} from "../../../../../features/testIds.ts";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { AutocompleteType, Input, InputType } from "../../../../components/input/input.tsx";
import { TextButton } from "../../../../components/textButton/textButton.tsx";

import {
  handleChange,
  handleRestorePassword,
  initRestorePasswordFormStore,
  restorePasswordFormStore,
  setRestorePasswordFormStore,
} from "./restorePasswordForm.store.ts";
import { isRestorePasswordFormValid, validateRestorePasswordForm } from "./utilities/restorePasswordFormValidations.ts";
import "./restorePasswordForm.css";

function onSubmit(e: SubmitEvent) {
  e.preventDefault();

  const validatedInputs = validateRestorePasswordForm(restorePasswordFormStore.inputs);
  setRestorePasswordFormStore("inputs", validatedInputs);

  if (isRestorePasswordFormValid(validatedInputs)) {
    handleRestorePassword();
  }
}

type RestorePasswordFormProps = {
  onSwitchBack: () => void;
};

export const RestorePasswordForm = (props: RestorePasswordFormProps) => {
  initRestorePasswordFormStore();

  const handleGoToLogin = () => {
    props.onSwitchBack();
  };

  return (
    <form class="restorePasswordForm__wrapper" method="post" onSubmit={onSubmit}>
      <div class="restorePasswordForm__backLink">
        <TextButton
          testId={RESTORE_PASS_BACK_TO_LOGIN_LINK}
          handleClick={handleGoToLogin}
          disabled={restorePasswordFormStore.isLoading}
        >
          Вернуться ко входу
        </TextButton>
      </div>
      <Switch>
        <Match when={restorePasswordFormStore.isSuccessful}>
          <div class="restorePasswordForm__success">
            Если данный пользователь зарегистрирован, на указанный email отправлена ссылка для восстановления доступа.
          </div>
        </Match>
        <Match when={!restorePasswordFormStore.isSuccessful}>
          <div class="restorePasswordForm__inputs">
            <span class="restorePasswordForm__title">Забыли пароль?</span>
            <label class="restorePasswordForm__label">
              <span class="restorePasswordForm__labelText">
                Укажите адрес электронной почты, который вы использовали при регистрации. Мы отправим ссылку для сброса
                пароля.
              </span>
              <Input
                type={InputType.Email}
                placeholder="example@email.com"
                name="Электронная почта"
                maxLength={MAX_EMAIL_LENGTH}
                testId={RESTORE_PASS_EMAIL_INPUT}
                required={true}
                error={!restorePasswordFormStore.inputs.email.isValid}
                onInput={handleChange("email")}
                disabled={restorePasswordFormStore.isLoading}
                autocomplete={AutocompleteType.Email}
              >
                {restorePasswordFormStore.inputs.email.value.toString()}
              </Input>
              <span class="restorePasswordForm__error">{restorePasswordFormStore.inputs.email.error}</span>
            </label>
            <Button
              testId={RESTORE_PASS_SUBMIT_BUTTON}
              type={ButtonType.Submit}
              loading={restorePasswordFormStore.isLoading}
            >
              Сбросить пароль
            </Button>
          </div>
        </Match>
      </Switch>
    </form>
  );
};
