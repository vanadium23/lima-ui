import { createEffect, createSignal } from "solid-js";

import { AUTH_TABS } from "../../../features/testIds.ts";
import { Tabs } from "../../components/tabs/tabs.tsx";
import { setUrlHash, urlHash } from "../../state/locationState.ts";

import { loginFormStore } from "./components/loginForm/loginForm.store.ts";
import { LoginForm } from "./components/loginForm/loginForm.tsx";
import { registrationFormStore } from "./components/registrationForm/registrationForm.store.ts";
import { RegistrationForm } from "./components/registrationForm/registrationForm.tsx";
import { restorePasswordFormStore } from "./components/restorePasswordForm/restorePasswordForm.store.ts";
import "./auth.css";

export type AuthType = "email" | "yandex" | "vk";

export type AuthFormInput = {
  value: string | boolean;
  isValid: boolean;
  error?: string;
};

export const [activeAuthForm, setActiveAuthForm] = createSignal(urlHash() ? urlHash().slice(1) : "login");

const authTabs = [
  {
    tabName: "Вход",
    content: <LoginForm onSwitchForm={() => setActiveAuthForm("register")} />,
  },
  {
    tabName: "Регистрация",
    content: <RegistrationForm onSwitchForm={() => setActiveAuthForm("login")} />,
  },
];

export const Auth = () => {
  const getActiveTabIdx = () => {
    const tab = activeAuthForm();

    if (tab === "register") {
      return 1;
    } else {
      return 0;
    }
  };

  const switchActiveTabIdx = (index: number) => {
    if (index === 0) {
      setActiveAuthForm("login");
    } else if (index === 1) {
      setActiveAuthForm("register");
    }
  };

  createEffect(() => {
    if (urlHash() !== activeAuthForm()) {
      history.pushState({}, "", `auth${window.location.search}#${activeAuthForm()}`);
      setUrlHash(`#${activeAuthForm()}`);
    }
  });

  const tabs = () => {
    const isLoading = registrationFormStore.isLoading || loginFormStore.isLoading || restorePasswordFormStore.isLoading;

    if (isLoading) {
      return authTabs.map((tab) => ({ ...tab, disabled: true }));
    }

    return authTabs;
  };

  return (
    <div class="auth">
      <div class="auth__wrapper wrapper">
        <div class="auth__greeting">
          <div class="auth__greetingInner">
            <div class="auth__greetingTitle">Начните работу с Лимой</div>
            <div class="auth__greetingDescription">Держите порядок всегда под рукой!</div>
          </div>
        </div>
        <div class="auth__tabs">
          <Tabs
            ariaLabel="Переключение форм входа\регистрации"
            tabs={tabs()}
            testId={AUTH_TABS}
            activeTab={getActiveTabIdx()}
            onSwitchActiveTab={switchActiveTabIdx}
          />
        </div>
      </div>
    </div>
  );
};
