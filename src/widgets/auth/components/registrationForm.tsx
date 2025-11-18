import { type JSXElement, Match, Switch } from "solid-js";

import {
  REG_ACCEPT_AGREEMENT,
  REG_CONFIDENTIAL_POLICY_LINK,
  REG_EMAIL_INPUT,
  REG_GO_TO_AUTH_LINK,
  REG_PASS_INPUT,
  REG_REPEAT_PASS_INPUT,
  REG_SUBMIT_BUTTON,
  REG_USERS_AGREEMENT_LINK,
} from "../../../../features/testIds.ts";
import { AuthButton } from "../../../components/authButton/authButton.tsx";
import { Button, ButtonType } from "../../../components/button/button.tsx";
import { Checkbox } from "../../../components/checkbox/checkbox.tsx";
import { Input, InputType } from "../../../components/input/input.tsx";
import { Link } from "../../../components/link/link.tsx";
import { TextButton } from "../../../components/textButton/textButton.tsx";

import { type RegistrationFormInputs } from "./registrationForm.model.ts";
import {
  handleChange,
  handleCheckboxChange,
  handleRegister,
  initRegistrationFormStore,
  registrationFormStore,
  setRegistrationFormStore,
} from "./registrationForm.store.ts";
import { isRegistrationFormValid, validateRegistrationForm } from "./registrationForm.utilities.ts";
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

function renderRegInputs(inputs: RegistrationFormInputs): JSXElement {
  const { email, pass, repeat_pass, accept_agreement } = inputs;

  return (
    <>
      <label class="regInput__container">
        <span class="regInput__label">{"Введите адрес вашей электронной почты"}</span>
        <Input
          type={email.type as InputType}
          placeholder="Электронная почта"
          name={REG_EMAIL_INPUT}
          maxLength={360}
          testId={REG_EMAIL_INPUT}
          required={true}
          error={!email.isValid}
          onInput={handleChange}
          disabled={registrationFormStore.isLoading}
        >
          {email.value.toString()}
        </Input>
        <span class="regInput__error">{email.error}</span>
      </label>
      <label class="regInput__container">
        <span class="regInput__label">{"Придумайте пароль"}</span>
        <span class="regInput__sub_label">{"минимум 8 символов, включая буквы латинского алфавита и цифры"}</span>
        <Input
          type={pass.type as InputType}
          placeholder="Пароль"
          name={REG_PASS_INPUT}
          maxLength={360}
          testId={REG_PASS_INPUT}
          required={true}
          error={!pass.isValid}
          onInput={handleChange}
          disabled={registrationFormStore.isLoading}
        >
          {pass.value.toString()}
        </Input>
        <span class="regInput__error">{pass.error}</span>
      </label>
      <label class="regInput__container">
        <span class="regInput__label">{"Повторите пароль"}</span>
        <Input
          type={repeat_pass.type as InputType}
          placeholder="Пароль"
          name={REG_REPEAT_PASS_INPUT}
          maxLength={360}
          testId={REG_REPEAT_PASS_INPUT}
          required={true}
          error={!repeat_pass.isValid}
          onInput={handleChange}
          disabled={registrationFormStore.isLoading}
        >
          {repeat_pass.value.toString()}
        </Input>
        <span class="regInput__error">{repeat_pass.error}</span>
      </label>
      <label class="regCheckbox__container">
        <Checkbox
          testId={REG_ACCEPT_AGREEMENT}
          error={!accept_agreement.isValid}
          checked={Boolean(accept_agreement.value)}
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
    </>
  );
}

function renderRegSocials(): JSXElement {
  return (
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
  );
}

function renderSuccess(): JSXElement {
  return (
    <div class="regForm__success">
      {"Мы отправили ссылку для входа на указанный адрес. Пожалуйста, проверьте вашу электронную почту."}
    </div>
  );
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
      <Match when={registrationFormStore.isSuccessful === true}>{renderSuccess()}</Match>
      <Match when={registrationFormStore.isSuccessful !== true}>
        <form class="regForm" method="post" onSubmit={onSubmit}>
          {renderRegSocials()}
          <span class="regForm__separator">{"или"}</span>
          <div class="regForm__inputs">
            {renderRegInputs(registrationFormStore.inputs)}
            <Button
              testId={REG_SUBMIT_BUTTON}
              type={ButtonType.Submit}
              loading={registrationFormStore.authType === "email" && registrationFormStore.isLoading}
              disabled={registrationFormStore.authType !== "email" && registrationFormStore.isLoading}
            >
              {"Зарегистрироваться"}
            </Button>
            <div class="regForm__goToAuth_container">
              <span class="regForm__goToAuth_text">{"Уже зарегистрированы?"}</span>
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
