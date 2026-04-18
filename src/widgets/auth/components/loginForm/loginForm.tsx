import { Match, Switch } from "solid-js";

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from "../../../../../configuration.ts";
import {
  LOGIN_EMAIL_INPUT,
  LOGIN_GO_TO_REG_LINK,
  LOGIN_PASS_INPUT,
  LOGIN_RESTORE_PASS_LINK,
  LOGIN_SUBMIT_BUTTON,
} from "../../../../../features/testIds.ts";
import { AuthButton } from "../../../../components/authButton/authButton.tsx";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { FormField } from "../../../../components/formField/formField.tsx";
import { AutocompleteType, InputType } from "../../../../components/input/input.tsx";
import { TextButton } from "../../../../components/textButton/textButton.tsx";
import { RestorePasswordForm } from "../restorePasswordForm/restorePasswordForm.tsx";

import {
  disableRestorePasswordMode,
  enableRestorePasswordMode,
  handleLogin,
  handleLoginInputChange,
  initLoginFormStore,
  loginFormStore,
  setLoginFormStore,
} from "./loginForm.store.ts";
import { isLoginFormValid, validateLoginForm } from "./utilities/loginFormValidations.ts";
import "./loginForm.css";

function onSubmit(e: SubmitEvent) {
  e.preventDefault();

  const validatedInputs = validateLoginForm(loginFormStore.inputs);
  setLoginFormStore("inputs", validatedInputs);

  if (isLoginFormValid(validatedInputs)) {
    handleLogin("email");
  }
}

type LoginFormProps = {
  onSwitchForm: () => void;
};

export const LoginForm = (props: LoginFormProps) => {
  initLoginFormStore();

  const handleGoToRegistration = () => {
    props.onSwitchForm();
  };

  const handleRestorePass = () => {
    enableRestorePasswordMode();
  };

  return (
    <Switch>
      <Match when={loginFormStore.isRestorePasswordMode}>
        <RestorePasswordForm onSwitchBack={disableRestorePasswordMode} />
      </Match>
      <Match when={!loginFormStore.isRestorePasswordMode}>
        <form class="loginForm__wrapper" method="post" onSubmit={onSubmit}>
          <div class="loginForm__socials">
            <AuthButton
              iconName={"vk"}
              testId={"vk_auth"}
              loading={loginFormStore.authType === "vk" && loginFormStore.isLoading}
              disabled={loginFormStore.authType !== "vk" && loginFormStore.isLoading}
              handleClick={() => handleLogin("vk")}
            >
              ВК
            </AuthButton>
            <AuthButton
              iconName={"yandex"}
              testId={"yandex_auth"}
              loading={loginFormStore.authType === "yandex" && loginFormStore.isLoading}
              disabled={loginFormStore.authType !== "yandex" && loginFormStore.isLoading}
              handleClick={() => handleLogin("yandex")}
            >
              Яндекс
            </AuthButton>
          </div>
          <span class="loginForm__separator">или</span>
          <div class="loginForm__inputs">
            <FormField
              labelText="Электронная почта"
              isError={!loginFormStore.inputs.email.isValid}
              errorText={loginFormStore.inputs.email.error}
              type={InputType.Email}
              placeholder="Электронная почта"
              name="Электронная почта"
              maxLength={MAX_EMAIL_LENGTH}
              testId={LOGIN_EMAIL_INPUT}
              required={true}
              onInput={handleLoginInputChange("email")}
              disabled={loginFormStore.isLoading}
              autocomplete={AutocompleteType.Email}
            >
              {loginFormStore.inputs.email.value.toString()}
            </FormField>
            <FormField
              labelText="Пароль"
              isError={!loginFormStore.inputs.pass.isValid}
              errorText={loginFormStore.inputs.pass.error}
              type={InputType.Password}
              placeholder="Введите пароль"
              name="Пароль"
              maxLength={MAX_PASSWORD_LENGTH}
              testId={LOGIN_PASS_INPUT}
              required={true}
              onInput={handleLoginInputChange("pass")}
              disabled={loginFormStore.isLoading}
              autocomplete={AutocompleteType.Password}
            >
              {loginFormStore.inputs.pass.value.toString()}
            </FormField>
            <Button
              testId={LOGIN_SUBMIT_BUTTON}
              type={ButtonType.Submit}
              loading={loginFormStore.authType === "email" && loginFormStore.isLoading}
              disabled={loginFormStore.authType !== "email" && loginFormStore.isLoading}
            >
              Войти
            </Button>
            <TextButton
              testId={LOGIN_RESTORE_PASS_LINK}
              handleClick={handleRestorePass}
              disabled={loginFormStore.isLoading}
            >
              Восстановить пароль
            </TextButton>
            <div class="loginForm__goToRegistration">
              <span class="loginForm__goToRegistrationText">Нет аккаунта?</span>
              <TextButton
                testId={LOGIN_GO_TO_REG_LINK}
                handleClick={handleGoToRegistration}
                disabled={loginFormStore.isLoading}
              >
                Зарегистрируйтесь
              </TextButton>
            </div>
          </div>
        </form>
      </Match>
    </Switch>
  );
};
