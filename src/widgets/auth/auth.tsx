import { createEffect, createSignal, Match, Switch } from "solid-js";

import { AUTH_TABS } from "../../../features/testIds.ts";
import { Tabs } from "../../components/tabs/tabs.tsx";
import { setUrlHash, urlHash } from "../../state/locationState.ts";
import { panelState } from "../../state/sidebarsStateManager.ts";

import { registrationFormStore } from "./components/registrationForm.store.ts";
import { RegistrationForm } from "./components/registrationForm.tsx";
import "./auth.css";

export const [activeAuthForm, setActiveAuthForm] = createSignal(urlHash() ? urlHash().slice(1) : "login");

const authTabs = [
  {
    tabName: "Вход",
    content: "Форма входа",
  },
  {
    tabName: "Регистарция",
    content: <RegistrationForm onSwitchForm={() => setActiveAuthForm("login")} />,
  },
];

export const Auth = () => {
  /* TODO: This is just before we implement Normal basic page template */
  panelState.closeSidebar();

  createEffect(() => {
    if (urlHash() !== activeAuthForm()) {
      history.pushState({}, "", `auth#${activeAuthForm()}`);
      setUrlHash(`#${activeAuthForm()}`);
    }
  });

  const tabs = () => {
    const isLoading = registrationFormStore.isLoading;

    if (isLoading) {
      return authTabs.map((tab) => ({ ...tab, disabled: true }));
    }

    return authTabs;
  };

  return (
    <div class="auth">
      <div class="authGreeting">
        <div class="authGreeting__titleContainer">
          <div class="authGreeting__title">{"Начните работу с Лимой"}</div>
          <div class="authGreeting__description">{"Держите порядок всегда под рукой!"}</div>
        </div>
        <img class="authGreeting__img" src="/old_man.png" height="603px" alt="=Lima" />
      </div>
      <div class="auth_tabs">
        <Switch>
          <Match when={activeAuthForm() === "register"}>
            <Tabs
              ariaLabel="Auth"
              tabs={tabs()}
              testId={AUTH_TABS}
              defaultActiveIndex={1}
              activeTab={1}
              onSwitchActiveTab={(index) => {
                if (index === 0) {
                  setActiveAuthForm("login");
                }
              }}
            />
          </Match>
          <Match when={activeAuthForm() === "login"}>
            <Tabs
              ariaLabel="Auth"
              tabs={tabs()}
              testId={AUTH_TABS}
              defaultActiveIndex={0}
              activeTab={0}
              onSwitchActiveTab={(index) => {
                if (index === 1) {
                  setActiveAuthForm("register");
                }
              }}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
};
