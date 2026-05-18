import { For, Show } from "solid-js";

import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../../../configuration.ts";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Accordion, AccordionSize, AccordionTheme } from "../../components/accordion/accordion.tsx";
import { AuthButton } from "../../components/authButton/authButton.tsx";
import { Button, ButtonTheme, ButtonType } from "../../components/button/button.tsx";
import { Dialog } from "../../components/dialog/dialog.tsx";
import { FormField } from "../../components/formField/formField.tsx";
import { AutocompleteType, Input, InputType } from "../../components/input/input.tsx";
import { TextButton } from "../../components/textButton/textButton.tsx";
import { Title } from "../../components/title/title.tsx";

import {
  accountStore,
  changePassword,
  confirmUnlinkService,
  deleteAccount,
  handleChangePasswordFormChange,
  handleDeleteAccountConfirmWordChange,
  handleEmailFormChange,
  linkEmail,
  linkService,
  setDeleteAccountDialogOpen,
  setServiceToUnlink,
} from "./account.store.ts";
import "./account.css";

export const Account = () => {
  const isAccountActionLoading = () =>
    Boolean(accountStore.unlinkingServiceId) ||
    Boolean(accountStore.linkingServiceId) ||
    accountStore.emailForm.isLoading ||
    accountStore.changePasswordForm.isLoading ||
    accountStore.deleteAccountForm.isLoading;

  const connectedAccounts = () => accountStore.connectedAccounts.filter((acc) => acc.isConnected);
  const hasConnectedAccounts = () => connectedAccounts().length > 0;
  const getService = (id: string) => accountStore.connectedAccounts.find((acc) => acc.id === id);
  const isConnected = (id: string) => getService(id)?.isConnected;

  return (
    <div class="account scrollStyles">
      <Title testId={DEFAULT_TEST_ID}>Личный кабинет</Title>
      <form class="account__username" method="post">
        <FormField
          labelText="Имя пользователя"
          hintText={`От ${MIN_USERNAME_LENGTH} до ${MAX_USERNAME_LENGTH} символов`}
          name="oldPass"
          placeholder="Введите имя"
          type={InputType.Text}
          autocomplete={AutocompleteType.Nickname}
          maxLength={MAX_USERNAME_LENGTH}
          minLength={MIN_USERNAME_LENGTH}
          testId={DEFAULT_TEST_ID}
          disabled={isAccountActionLoading()}
        />
        <Button type={ButtonType.Submit} testId={DEFAULT_TEST_ID}>
          Сохранить
        </Button>
      </form>
      <Accordion
        title={"Способы входа"}
        size={AccordionSize.Large}
        theme={AccordionTheme.Secondary}
        testId={DEFAULT_TEST_ID}
      >
        <div class="account__accordion">
          <Show when={hasConnectedAccounts()}>
            <div class="account__accordionSection">
              <For each={connectedAccounts()}>
                {(account) => (
                  <div class="account__authMethod">
                    <div class="account__authMethodInfo">
                      <span class="account__authMethodInfoTitle">{account.name}</span>
                      <span class="account__authMethodInfoValue">{account.value}</span>
                    </div>
                    <Show when={account.id !== "email" && connectedAccounts().length > 1}>
                      <div class="account__authMethodRemove">
                        <TextButton
                          handleClick={() => setServiceToUnlink(account)}
                          testId={DEFAULT_TEST_ID}
                          loading={accountStore.unlinkingServiceId === account.id}
                          disabled={isAccountActionLoading() && accountStore.unlinkingServiceId !== account.id}
                        >
                          Отвязать
                        </TextButton>
                      </div>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>
          <Show when={!isConnected("vk") || !isConnected("yandex")}>
            <div class="account__accordionSection">
              <div class="account__authServices">
                <span class="account__subTitle">Привяжите свою учетную запись для быстрой авторизации</span>

                <div class="account__authServicesList">
                  <For each={accountStore.connectedAccounts.filter((acc) => acc.id !== "email" && !acc.isConnected)}>
                    {(account) => (
                      <AuthButton
                        iconName={account.iconName!}
                        handleClick={() => linkService(account.id)}
                        testId={DEFAULT_TEST_ID}
                        loading={accountStore.linkingServiceId === account.id}
                        disabled={isAccountActionLoading() && accountStore.linkingServiceId !== account.id}
                      >
                        {account.name}
                      </AuthButton>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </Show>
          <Show when={!isConnected("email")}>
            <div class="account__accordionSection">
              <span class="account__subTitle">Добавить электронную почту для входа в аккаунт</span>
              <div class="account__accordionWrapper">
                <div class="account__accordionInner">
                  <FormField
                    labelText="Электронная почта"
                    errorText={accountStore.emailForm.email.error}
                    isError={!accountStore.emailForm.email.isValid}
                    name="email"
                    placeholder="example@email.com"
                    type={InputType.Email}
                    autocomplete={AutocompleteType.Email}
                    maxLength={MAX_EMAIL_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) => handleEmailFormChange("email", (e.target as HTMLInputElement).value)}
                  >
                    {accountStore.emailForm.email.value}
                  </FormField>
                  <FormField
                    labelText="Придумайте пароль"
                    hintText={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы [a-z] и цифры [0-9]`}
                    errorText={accountStore.emailForm.pass.error}
                    isError={!accountStore.emailForm.pass.isValid}
                    name="pass"
                    placeholder="Введите пароль"
                    type={InputType.Password}
                    autocomplete={AutocompleteType.NewPassword}
                    maxLength={MAX_PASSWORD_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) => handleEmailFormChange("pass", (e.target as HTMLInputElement).value)}
                  >
                    {accountStore.emailForm.pass.value}
                  </FormField>
                  <FormField
                    labelText="Повторите пароль"
                    errorText={accountStore.emailForm.repeatPass.error}
                    isError={!accountStore.emailForm.repeatPass.isValid}
                    name="repeatPass"
                    placeholder="Ввидите пароль"
                    type={InputType.Password}
                    autocomplete={AutocompleteType.NewPassword}
                    maxLength={MAX_PASSWORD_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) => handleEmailFormChange("repeatPass", (e.target as HTMLInputElement).value)}
                  >
                    {accountStore.emailForm.repeatPass.value}
                  </FormField>
                </div>
                <Button
                  testId={DEFAULT_TEST_ID}
                  loading={accountStore.emailForm.isLoading}
                  disabled={isAccountActionLoading() && !accountStore.emailForm.isLoading}
                  handleClick={linkEmail}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </Show>
        </div>
      </Accordion>
      <Show when={isConnected("email")}>
        <Accordion
          title={"Сменить пароль"}
          size={AccordionSize.Large}
          theme={AccordionTheme.Secondary}
          testId={DEFAULT_TEST_ID}
        >
          <div class="account__accordion">
            <div class="account__accordionSection">
              <span class="account__subTitle">Вы можете изменить пароль для входа в аккаунт</span>
              <div class="account__accordionWrapper">
                <div class="account__accordionInner">
                  <FormField
                    labelText="Текущий пароль"
                    errorText={accountStore.changePasswordForm.oldPass.error}
                    isError={!accountStore.changePasswordForm.oldPass.isValid}
                    name="oldPass"
                    placeholder="Введите пароль"
                    type={InputType.Password}
                    autocomplete={AutocompleteType.Password}
                    maxLength={MAX_PASSWORD_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) => handleChangePasswordFormChange("oldPass", (e.target as HTMLInputElement).value)}
                  >
                    {accountStore.changePasswordForm.oldPass.value}
                  </FormField>
                  <FormField
                    labelText="Новый пароль"
                    hintText={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы [a-z] и цифры [0-9]`}
                    errorText={accountStore.changePasswordForm.newPass.error}
                    isError={!accountStore.changePasswordForm.newPass.isValid}
                    name="newPass"
                    placeholder="Введите пароль"
                    type={InputType.Password}
                    autocomplete={AutocompleteType.NewPassword}
                    maxLength={MAX_PASSWORD_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) => handleChangePasswordFormChange("newPass", (e.target as HTMLInputElement).value)}
                  >
                    {accountStore.changePasswordForm.newPass.value}
                  </FormField>
                  <FormField
                    labelText="Повторите пароль"
                    errorText={accountStore.changePasswordForm.repeatNewPass.error}
                    isError={!accountStore.changePasswordForm.repeatNewPass.isValid}
                    name="repeatNewPass"
                    placeholder="Введите пароль"
                    type={InputType.Password}
                    autocomplete={AutocompleteType.NewPassword}
                    maxLength={MAX_PASSWORD_LENGTH}
                    testId={DEFAULT_TEST_ID}
                    disabled={isAccountActionLoading()}
                    onInput={(e) =>
                      handleChangePasswordFormChange("repeatNewPass", (e.target as HTMLInputElement).value)
                    }
                  >
                    {accountStore.changePasswordForm.repeatNewPass.value}
                  </FormField>
                </div>
                <Button
                  testId={DEFAULT_TEST_ID}
                  loading={accountStore.changePasswordForm.isLoading}
                  disabled={isAccountActionLoading() && !accountStore.changePasswordForm.isLoading}
                  handleClick={changePassword}
                >
                  Сменить пароль
                </Button>
              </div>
            </div>
          </div>
        </Accordion>
      </Show>
      <Accordion
        title={"Управление аккаунтом"}
        size={AccordionSize.Large}
        theme={AccordionTheme.Secondary}
        testId={DEFAULT_TEST_ID}
      >
        <div class="account__accordion">
          <div class="account__accordionSection">
            <span class="account__subTitle">Вы можете удалить аккаунт и все списки без возможности восстановления</span>
            <Button
              theme={ButtonTheme.Dangerous}
              testId={DEFAULT_TEST_ID}
              disabled={isAccountActionLoading()}
              handleClick={() => setDeleteAccountDialogOpen(true)}
            >
              Удалить аккаунт
            </Button>
          </div>
        </div>
      </Accordion>

      <Dialog
        open={Boolean(accountStore.serviceToUnlink)}
        onCancel={() => setServiceToUnlink(null)}
        title="Подтверждение отвязки"
        testId={DEFAULT_TEST_ID}
        controls={
          <Button theme={ButtonTheme.Dangerous} testId={DEFAULT_TEST_ID} handleClick={confirmUnlinkService}>
            Отвязать
          </Button>
        }
      >
        <div class="account__removeAuthServiceText">
          Вы точно хотите отвязать{" "}
          <span class="account__removeAuthServiceName">
            {accountStore.serviceToUnlink?.name} {accountStore.serviceToUnlink?.value}
          </span>
          ? Вы больше не сможете использовать его для входа в аккаунт Лимы.
        </div>
      </Dialog>

      <Dialog
        open={accountStore.deleteAccountForm.isOpen}
        onCancel={() => setDeleteAccountDialogOpen(false)}
        title="Удаление аккаунта"
        testId={DEFAULT_TEST_ID}
        loading={accountStore.deleteAccountForm.isLoading}
        controls={
          <Button
            theme={ButtonTheme.Dangerous}
            testId={DEFAULT_TEST_ID}
            disabled={accountStore.deleteAccountForm.confirmWord.toUpperCase() !== "УДАЛИТЬ"}
            handleClick={deleteAccount}
          >
            Удалить
          </Button>
        }
      >
        <div class="account__removeAccountDialogWrapper">
          <p class="account__removeAccountText">
            Вы точно хотите удалить аккаунт{" "}
            <span class="account__removeAuthServiceName">
              {accountStore.connectedAccounts.find((acc) => acc.isConnected)?.value}
            </span>
            ? Все списки будут стёрты безвозвратно.
          </p>
          <p class="account__removeAccountText">Для подтверждения введите слово «УДАЛИТЬ»</p>
          <Input
            name="confirmDelete"
            placeholder="Введите слово «УДАЛИТЬ»"
            maxLength={7}
            testId={DEFAULT_TEST_ID}
            onInput={(e) => handleDeleteAccountConfirmWordChange((e.target as HTMLInputElement).value)}
          >
            {accountStore.deleteAccountForm.confirmWord}
          </Input>
        </div>
      </Dialog>
    </div>
  );
};
