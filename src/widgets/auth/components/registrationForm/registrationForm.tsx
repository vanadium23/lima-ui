import { Match, Switch } from "solid-js";

import {
  DEFAULT_TEST_ID,
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
import { HintErrorReplaceableText } from "../../../../components/hintErrorReplaceableText/hintErrorReplaceableText.tsx";
import { AutocompleteType, Input, InputType } from "../../../../components/input/input.tsx";
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
    <div class="registrationsForm">
      <Switch>
        <Match when={registrationFormStore.isSuccessful}>
          <div class="registrationsForm__success">
            Мы отправили ссылку для входа на указанный адрес. Пожалуйста, проверьте вашу электронную почту.
          </div>
        </Match>
        <Match when={!registrationFormStore.isSuccessful}>
          <form class="registrationsForm__wrapper" method="post" onSubmit={onSubmit}>
            <div class="registrationsForm__socials">
              <AuthButton
                iconName={"google"}
                testId={DEFAULT_TEST_ID}
                loading={registrationFormStore.authType === "google" && registrationFormStore.isLoading}
                disabled={registrationFormStore.isLoading}
                handleClick={() => handleRegister("google")}
              >
                Google
              </AuthButton>
              <AuthButton
                iconName={"vk"}
                testId={DEFAULT_TEST_ID}
                loading={registrationFormStore.authType === "vk" && registrationFormStore.isLoading}
                disabled={registrationFormStore.isLoading}
                handleClick={() => handleRegister("vk")}
              >
                ВК
              </AuthButton>
              <AuthButton
                iconName={"yandex"}
                testId={DEFAULT_TEST_ID}
                loading={registrationFormStore.authType === "yandex" && registrationFormStore.isLoading}
                disabled={registrationFormStore.isLoading}
                handleClick={() => handleRegister("yandex")}
              >
                Яндекс
              </AuthButton>
            </div>
            <span class="registrationsForm__separator">или</span>
            <div class="registrationsForm__inputs">
              <label class="registrationsForm__label">
                <span class="registrationsForm__labelText">Электронная почта</span>
                <Input
                  type={InputType.Email}
                  placeholder="example@email.ru"
                  name="Электронная почта"
                  maxLength={360}
                  testId={REG_EMAIL_INPUT}
                  required={true}
                  error={!registrationFormStore.inputs.email.isValid}
                  onInput={handleChange("email")}
                  disabled={registrationFormStore.isLoading}
                  autocomplete={AutocompleteType.Email}
                >
                  {registrationFormStore.inputs.email.value.toString()}
                </Input>
                <span class="registrationsForm__error" aria-live="polite" aria-atomic="true">
                  {registrationFormStore.inputs.email.error}
                </span>
              </label>
              <label class="registrationsForm__label">
                <span class="registrationsForm__labelText">Придумайте пароль</span>

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
                  autocomplete={AutocompleteType.NewPassword}
                >
                  {registrationFormStore.inputs.pass.value.toString()}
                </Input>
                <HintErrorReplaceableText
                  hintText={"Минимум 8 символов: буквы (a-z) и цифры (0-9)"}
                  errorText={registrationFormStore.inputs.pass.error}
                  isError={!registrationFormStore.inputs.pass.isValid}
                  testId={DEFAULT_TEST_ID}
                />
              </label>
              <label class="registrationsForm__label">
                <span class="registrationsForm__labelText">Повторите пароль</span>
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
                  autocomplete={AutocompleteType.NewPassword}
                >
                  {registrationFormStore.inputs.repeat_pass.value.toString()}
                </Input>
                <span class="registrationsForm__error" aria-live="polite" aria-atomic="true">
                  {registrationFormStore.inputs.repeat_pass.error}
                </span>
              </label>
              <label class="registrationsForm__policyLabel">
                <Checkbox
                  testId={REG_ACCEPT_AGREEMENT}
                  error={!registrationFormStore.inputs.accept_agreement.isValid}
                  checked={Boolean(registrationFormStore.inputs.accept_agreement.value)}
                  onChange={handleCheckboxChange}
                  disabled={registrationFormStore.isLoading}
                  dependent={true}
                  name={"Пользовательское соглашение"}
                  required={true}
                />
                <span class="registrationsForm__policyLabelText">
                  Я даю согласие на обработку моих персональных данных в соответствии с{" "}
                  <Link href="#" testId={REG_CONFIDENTIAL_POLICY_LINK} disabled={registrationFormStore.isLoading}>
                    Политикой конфиденциальности
                  </Link>{" "}
                  и{" "}
                  <Link href="#" testId={REG_USERS_AGREEMENT_LINK} disabled={registrationFormStore.isLoading}>
                    Пользовательским соглашением
                  </Link>
                </span>
              </label>
              <Button
                testId={REG_SUBMIT_BUTTON}
                type={ButtonType.Submit}
                loading={registrationFormStore.authType === "email" && registrationFormStore.isLoading}
                disabled={registrationFormStore.authType !== "email" && registrationFormStore.isLoading}
              >
                Зарегистрироваться
              </Button>
              <div class="registrationsForm__goToAuth">
                <span class="registrationsForm__goToAuthText">Уже зарегистрированы?</span>
                <TextButton
                  testId={REG_GO_TO_AUTH_LINK}
                  handleClick={handleGoToAuth}
                  disabled={registrationFormStore.isLoading}
                >
                  Войдите
                </TextButton>
              </div>
            </div>
          </form>
        </Match>
      </Switch>
    </div>
  );
};
