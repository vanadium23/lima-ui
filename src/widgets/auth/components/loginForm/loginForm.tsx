import {
  LOGIN_EMAIL_INPUT,
  LOGIN_GO_TO_REG_LINK,
  LOGIN_PASS_INPUT,
  LOGIN_RESTORE_PASS_LINK,
  LOGIN_SUBMIT_BUTTON,
} from "../../../../../features/testIds.ts";
import { AuthButton } from "../../../../components/authButton/authButton.tsx";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { Input, InputType } from "../../../../components/input/input.tsx";
import { TextButton } from "../../../../components/textButton/textButton.tsx";

import {
  handleChange,
  handleRegister,
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
    handleRegister("email");
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
    console.log("Switch to restore password screen");
  };

  return (
    <form class="loginForm" method="post" onSubmit={onSubmit}>
      <div class="loginForm__socials">
        <AuthButton
          iconName={"google"}
          testId={"google_auth"}
          loading={loginFormStore.authType === "google" && loginFormStore.isLoading}
          disabled={loginFormStore.isLoading}
          handleClick={() => handleRegister("google")}
        >
          {"Google"}
        </AuthButton>
        <AuthButton
          iconName={"vk"}
          testId={"vk_auth"}
          loading={loginFormStore.authType === "vk" && loginFormStore.isLoading}
          disabled={loginFormStore.isLoading}
          handleClick={() => handleRegister("vk")}
        >
          {"ВК"}
        </AuthButton>
        <AuthButton
          iconName={"yandex"}
          testId={"yandex_auth"}
          loading={loginFormStore.authType === "yandex" && loginFormStore.isLoading}
          disabled={loginFormStore.isLoading}
          handleClick={() => handleRegister("yandex")}
        >
          {"Яндекс"}
        </AuthButton>
      </div>
      <span class="loginForm__separator">{"или"}</span>
      <div class="loginForm__inputs">
        <label class="loginInput__container">
          <span class="loginInput__label">{"Введите адрес вашей электронной почты"}</span>
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
          >
            {loginFormStore.inputs.email.value.toString()}
          </Input>
          <span class="loginInput__error">{loginFormStore.inputs.email.error}</span>
        </label>
        <label class="loginInput__container">
          <span class="loginInput__label">{"Введите пароль"}</span>
          <Input
            type={InputType.Password}
            placeholder="Пароль"
            name="Пароль"
            maxLength={360}
            testId={LOGIN_PASS_INPUT}
            required={true}
            error={!loginFormStore.inputs.pass.isValid}
            onInput={handleChange("pass")}
            disabled={loginFormStore.isLoading}
          >
            {loginFormStore.inputs.pass.value.toString()}
          </Input>
          <span class="loginInput__error">{loginFormStore.inputs.pass.error}</span>
        </label>
        <Button
          testId={LOGIN_SUBMIT_BUTTON}
          type={ButtonType.Submit}
          loading={loginFormStore.authType === "email" && loginFormStore.isLoading}
          disabled={loginFormStore.authType !== "email" && loginFormStore.isLoading}
        >
          {"Войти"}
        </Button>
        <TextButton
          testId={LOGIN_RESTORE_PASS_LINK}
          handleClick={handleRestorePass}
          disabled={loginFormStore.isLoading}
        >
          {"Восстановить пароль"}
        </TextButton>
        <div class="loginForm__goToRegContainer">
          <span class="loginForm__goToRegText">{"Нет аккаунта?"}</span>
          <TextButton
            testId={LOGIN_GO_TO_REG_LINK}
            handleClick={handleGoToRegistration}
            disabled={loginFormStore.isLoading}
          >
            {"Зарегистрируйтесь"}
          </TextButton>
        </div>
      </div>
    </form>
  );
};
