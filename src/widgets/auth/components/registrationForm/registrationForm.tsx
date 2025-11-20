import { Match, Switch } from "solid-js";

import {
  REG_ACCEPT_AGREEMENT,
  REG_CONFIDENTIAL_POLICY_LINK,
  REG_EMAIL_INPUT,
  REG_GO_TO_AUTH_LINK,
  REG_PASS_INPUT,
  REG_REPEAT_PASS_INPUT,
  REG_SUBMIT_BUTTON,
  REG_USERS_AGREEMENT_LINK,
} from "../../../../../features/testIds.ts";
import { AuthButton } from "../../../../components/authButton/authButton.tsx";
import { Button, ButtonType } from "../../../../components/button/button.tsx";
import { Checkbox } from "../../../../components/checkbox/checkbox.tsx";
import { Input, InputType } from "../../../../components/input/input.tsx";
import { Link } from "../../../../components/link/link.tsx";
import { TextButton } from "../../../../components/textButton/textButton.tsx";

import {
  handleChange,
  handleCheckboxChange,
  handleRegister,
  initRegistrationFormStore,
  registrationFormStore,
  setRegistrationFormStore,
} from "./registrationForm.store.ts";
import { isRegistrationFormValid, validateRegistrationForm } from "./utilities/registrationFormValidations.ts";
import "./registrationForm.css";

function onSubmit(e: SubmitEvent) {
  e.preventDefault();

  if (registrationFormStore.inputs.accept_agreement.value) {
    const validatedInputs = validateRegistrationForm(registrationFormStore.inputs);
    setRegistrationFormStore("inputs", validatedInputs);

    if (isRegistrationFormValid(validatedInputs)) {
      handleRegister("email");
    }
  } else {
    setRegistrationFormStore("inputs", "accept_agreement", "isValid", false);
    setRegistrationFormStore("inputs", "accept_agreement", "error", "Необходимо принять пользовательское соглашение");
  }
}

type RegistrationFormProps = {
  onSwitchForm: () => void;
};

export const RegistrationForm = (props: RegistrationFormProps) => {
  initRegistrationFormStore();

  const handleGoToAuth = () => {
    props.onSwitchForm();
  };

  return (
    <Switch>
      <Match when={registrationFormStore.isSuccessful === true}>
        <div class="regForm__success">
          {"Мы отправили ссылку для входа на указанный адрес. Пожалуйста, проверьте вашу электронную почту."}
        </div>
      </Match>
      <Match when={registrationFormStore.isSuccessful !== true}>
        <form class="regForm" method="post" onSubmit={onSubmit}>
          <div class="regForm__socials">
            <AuthButton
              iconName={"google"}
              testId={"google_auth"}
              loading={registrationFormStore.authType === "google" && registrationFormStore.isLoading}
              disabled={registrationFormStore.isLoading}
              handleClick={() => handleRegister("google")}
            >
              {"Google"}
            </AuthButton>
            <AuthButton
              iconName={"vk"}
              testId={"vk_auth"}
              loading={registrationFormStore.authType === "vk" && registrationFormStore.isLoading}
              disabled={registrationFormStore.isLoading}
              handleClick={() => handleRegister("vk")}
            >
              {"ВК"}
            </AuthButton>
            <AuthButton
              iconName={"yandex"}
              testId={"yandex_auth"}
              loading={registrationFormStore.authType === "yandex" && registrationFormStore.isLoading}
              disabled={registrationFormStore.isLoading}
              handleClick={() => handleRegister("yandex")}
            >
              {"Яндекс"}
            </AuthButton>
          </div>
          <span class="regForm__separator">{"или"}</span>
          <div class="regForm__inputs">
            <label class="regInput__container">
              <span class="regInput__label">{"Введите адрес вашей электронной почты"}</span>
              <Input
                type={InputType.Email}
                placeholder="Электронная почта"
                name="Электронная почта"
                maxLength={360}
                testId={REG_EMAIL_INPUT}
                required={true}
                error={!registrationFormStore.inputs.email.isValid}
                onInput={handleChange("email")}
                disabled={registrationFormStore.isLoading}
              >
                {registrationFormStore.inputs.email.value.toString()}
              </Input>
              <span class="regInput__error">{registrationFormStore.inputs.email.error}</span>
            </label>
            <label class="regInput__container">
              <span class="regInput__label">{"Придумайте пароль"}</span>
              <span class="regInput__subLabel">{"минимум 8 символов, включая буквы латинского алфавита и цифры"}</span>
              <Input
                type={InputType.Password}
                placeholder="Пароль"
                name="Пароль"
                maxLength={360}
                testId={REG_PASS_INPUT}
                required={true}
                error={!registrationFormStore.inputs.pass.isValid}
                onInput={handleChange("pass")}
                disabled={registrationFormStore.isLoading}
              >
                {registrationFormStore.inputs.pass.value.toString()}
              </Input>
              <span class="regInput__error">{registrationFormStore.inputs.pass.error}</span>
            </label>
            <label class="regInput__container">
              <span class="regInput__label">{"Повторите пароль"}</span>
              <Input
                type={InputType.Password}
                placeholder="Пароль"
                name="Повторный пароль"
                maxLength={360}
                testId={REG_REPEAT_PASS_INPUT}
                required={true}
                error={!registrationFormStore.inputs.repeat_pass.isValid}
                onInput={handleChange("repeat_pass")}
                disabled={registrationFormStore.isLoading}
              >
                {registrationFormStore.inputs.repeat_pass.value.toString()}
              </Input>
              <span class="regInput__error">{registrationFormStore.inputs.repeat_pass.error}</span>
            </label>
            <label class="regCheckbox__container">
              <Checkbox
                testId={REG_ACCEPT_AGREEMENT}
                error={!registrationFormStore.inputs.accept_agreement.isValid}
                checked={Boolean(registrationFormStore.inputs.accept_agreement.value)}
                onChange={handleCheckboxChange}
                disabled={registrationFormStore.isLoading}
              />
              <div class="regCheckbox__label">
                <span>{"Я даю согласие на обработку моих персональных данных в соответствии с "}</span>
                <Link href="#" testId={REG_CONFIDENTIAL_POLICY_LINK} disabled={registrationFormStore.isLoading}>
                  {"Политикой конфиденциальности"}
                </Link>
                <span>{" и "}</span>
                <Link href="#" testId={REG_USERS_AGREEMENT_LINK} disabled={registrationFormStore.isLoading}>
                  {"Пользовательским соглашением"}
                </Link>
              </div>
            </label>
            <Button
              testId={REG_SUBMIT_BUTTON}
              type={ButtonType.Submit}
              loading={registrationFormStore.authType === "email" && registrationFormStore.isLoading}
              disabled={registrationFormStore.authType !== "email" && registrationFormStore.isLoading}
            >
              {"Зарегистрироваться"}
            </Button>
            <div class="regForm__goToAuthContainer">
              <span class="regForm__goToAuthText">{"Уже зарегистрированы?"}</span>
              <TextButton
                testId={REG_GO_TO_AUTH_LINK}
                handleClick={handleGoToAuth}
                disabled={registrationFormStore.isLoading}
              >
                {"Войдите"}
              </TextButton>
            </div>
          </div>
        </form>
      </Match>
    </Switch>
  );
};
