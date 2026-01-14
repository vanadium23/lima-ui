import { Match, Switch } from "solid-js";

import {
  LOGIN_EMAIL_INPUT,
  LOGIN_GO_TO_REG_LINK,
  LOGIN_PASS_INPUT,
  LOGIN_RESTORE_PASS_LINK,
  LOGIN_SUBMIT_BUTTON,
} from "../../../../../features/testIds.ts";
import { AuthButton } from "../../../../components/authButton/authButton.tsx";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { AutocompleteType, Input, InputType } from "../../../../components/input/input.tsx";
import { TextButton } from "../../../../components/textButton/textButton.tsx";
import { RestorePasswordForm } from "../restorePasswordForm/restorePasswordForm.tsx";

import {
  disableRestorePasswordMode,
  enableRestorePasswordMode,
  handleChange,
  handleLogin,
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
              iconName={"google"}
              testId={"google_auth"}
              loading={loginFormStore.authType === "google" && loginFormStore.isLoading}
              disabled={loginFormStore.authType !== "google" && loginFormStore.isLoading}
              handleClick={() => handleLogin("google")}
            >
              Google
            </AuthButton>
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
            <label class="loginForm__label">
              <span class="loginForm__labelText">{"Электронная почта"}</span>
              <Input
                type={InputType.Email}
                placeholder="Электронная почта"
                name="Электронная почта"
                maxLength={360}
                testId={LOGIN_EMAIL_INPUT}
                required={true}
                error={!loginFormStore.inputs.email.isValid}
                onInput={handleChange("email")}
                disabled={loginFormStore.isLoading}
                autocomplete={AutocompleteType.Email}
              >
                {loginFormStore.inputs.email.value.toString()}
              </Input>
              <span class="loginForm__error">{loginFormStore.inputs.email.error}</span>
            </label>
            <label class="loginForm__label">
              <span class="loginForm__labelText">{"Пароль"}</span>
              <Input
                type={InputType.Password}
                placeholder="Введите пароль"
                name="Пароль"
                maxLength={360}
                testId={LOGIN_PASS_INPUT}
                required={true}
                error={!loginFormStore.inputs.pass.isValid}
                onInput={handleChange("pass")}
                disabled={loginFormStore.isLoading}
                autocomplete={AutocompleteType.Password}
              >
                {loginFormStore.inputs.pass.value.toString()}
              </Input>
              <span class="loginForm__error">{loginFormStore.inputs.pass.error}</span>
            </label>
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
