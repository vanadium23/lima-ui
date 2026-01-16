import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Accordion, AccordionSize, AccordionTheme } from "../../components/accordion/accordion.tsx";
import { AuthButton } from "../../components/authButton/authButton.tsx";
import { Button, ButtonSize, ButtonTheme } from "../../components/button/button.tsx";
import { Divider } from "../../components/divider/divider.tsx";
import { TextButton } from "../../components/textButton/textButton.tsx";
import { Title } from "../../components/title/title.tsx";

import "./account.css";

export const Account = () => {
  return (
    <div class="account scrollStyles">
      <div class="account__auth">
        <Title testId={DEFAULT_TEST_ID}>Личный кабинет</Title>
        <div class="account__authServices">
          <span class="account__authServicesTitle">Способы входа</span>
          <span class="account__authServicesSubTitle">Привяжите свою учетную запись для быстрой авторизации</span>
          <div class="account__authServicesList">
            <AuthButton iconName={"google"} testId={DEFAULT_TEST_ID}>
              Google
            </AuthButton>
            <AuthButton iconName={"google"} testId={DEFAULT_TEST_ID}>
              Google
            </AuthButton>
            <AuthButton iconName={"google"} testId={DEFAULT_TEST_ID}>
              Google
            </AuthButton>
          </div>
        </div>
        <div class="account__authMethod">
          <div class="account__authMethodInfo">
            <span class="account__authMethodInfoTitle">Эл.Почта</span>
            <span class="account__authMethodInfoValue">example@gmail.com</span>
          </div>
          <div class="account__authMethodRemove">
            <TextButton testId={DEFAULT_TEST_ID}>Отвязать</TextButton>
          </div>
        </div>
      </div>
      <Divider />
      <div class="account__newPassword">
        <Accordion
          title={"Сменить пароль"}
          size={AccordionSize.Large}
          theme={AccordionTheme.Secondary}
          testId={DEFAULT_TEST_ID}
        >
          S
        </Accordion>
      </div>
      <Divider />
      <div class="account__settings">
        <Accordion
          title={"Управление аккаунтом"}
          size={AccordionSize.Large}
          theme={AccordionTheme.Secondary}
          testId={DEFAULT_TEST_ID}
        >
          <div class="account__settingsWrapper">
            <span class="account__settingTitle">
              Вы можете удалить аккаунт и все списки без возможности восстановления
            </span>
            <Button theme={ButtonTheme.Dangerous} size={ButtonSize.Medium} testId={DEFAULT_TEST_ID}>
              Удалить аккаунт
            </Button>
          </div>
        </Accordion>
      </div>
    </div>
  );
};
