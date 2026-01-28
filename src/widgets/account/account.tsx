import { For, Match, Show, Switch } from "solid-js";

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../../../configuration.ts";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Accordion, AccordionSize, AccordionTheme } from "../../components/accordion/accordion.tsx";
import { AuthButton } from "../../components/authButton/authButton.tsx";
import { Button, ButtonTheme } from "../../components/button/button.tsx";
import { Dialog } from "../../components/dialog/dialog.tsx";
import { Divider } from "../../components/divider/divider.tsx";
import { HintForInput } from "../../components/hintErrorReplaceableText/hintForInput.tsx";
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

  const getService = (id: string) => accountStore.connectedAccounts.find((acc) => acc.id === id);
  const isConnected = (id: string) => getService(id)?.isConnected;

  return (
    <div class="account scrollStyles">
      <div class="account__auth">
        <Title testId={DEFAULT_TEST_ID}>Личный кабинет</Title>
        <div class="account__authServices">
          <span class="account__title">Способы входа</span>
          <Show when={!isConnected("google") || !isConnected("vk") || !isConnected("yandex")}>
            <span class="account__subTitle">Привяжите свою учетную запись для быстрой авторизации</span>
          </Show>
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
        <For each={accountStore.connectedAccounts.filter((acc) => acc.isConnected)}>
          {(account) => (
            <div class="account__authMethod">
              <div class="account__authMethodInfo">
                <span class="account__authMethodInfoTitle">{account.name}</span>
                <span class="account__authMethodInfoValue">{account.value}</span>
              </div>
              <Show
                when={
                  account.id !== "email" && accountStore.connectedAccounts.filter((acc) => acc.isConnected).length > 1
                }
              >
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
      <Divider />
      <div class="account__section">
        <Switch>
          <Match when={!isConnected("email")}>
            <Accordion
              title={"Добавить электронную почту"}
              size={AccordionSize.Large}
              theme={AccordionTheme.Secondary}
              testId={DEFAULT_TEST_ID}
            >
              <div class="account__accordion">
                <span class="account__subTitle">Вы можете добавить электронную почту для входа в аккаунт</span>
                <div class="account__accordionWrapper">
                  <div class="account__accordionInner">
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Электронная почта</span>
                        <Input
                          name="email"
                          placeholder="example@email.com"
                          type={InputType.Email}
                          autocomplete={AutocompleteType.Email}
                          maxLength={MAX_EMAIL_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.emailForm.email.isValid}
                          onInput={(e) => handleEmailFormChange("email", (e.target as HTMLInputElement).value)}
                        >
                          {accountStore.emailForm.email.value}
                        </Input>
                      </label>
                      <HintForInput
                        errorText={accountStore.emailForm.email.error}
                        isError={!accountStore.emailForm.email.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Придумайте пароль</span>
                        <Input
                          name="pass"
                          placeholder="Введите пароль"
                          type={InputType.Password}
                          autocomplete={AutocompleteType.NewPassword}
                          maxLength={MAX_PASSWORD_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.emailForm.pass.isValid}
                          onInput={(e) => handleEmailFormChange("pass", (e.target as HTMLInputElement).value)}
                        >
                          {accountStore.emailForm.pass.value}
                        </Input>
                      </label>
                      <HintForInput
                        hintText={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы [a-z] и цифры [0-9]`}
                        errorText={accountStore.emailForm.pass.error}
                        isError={!accountStore.emailForm.pass.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Повторите пароль</span>
                        <Input
                          name="repeatPass"
                          placeholder="Ввидите пароль"
                          type={InputType.Password}
                          autocomplete={AutocompleteType.NewPassword}
                          maxLength={MAX_PASSWORD_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.emailForm.repeatPass.isValid}
                          onInput={(e) => handleEmailFormChange("repeatPass", (e.target as HTMLInputElement).value)}
                        >
                          {accountStore.emailForm.repeatPass.value}
                        </Input>
                      </label>
                      <HintForInput
                        errorText={accountStore.emailForm.repeatPass.error}
                        isError={!accountStore.emailForm.repeatPass.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
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
            </Accordion>
          </Match>
          <Match when={isConnected("email")}>
            <Accordion
              title={"Сменить пароль"}
              size={AccordionSize.Large}
              theme={AccordionTheme.Secondary}
              testId={DEFAULT_TEST_ID}
            >
              <div class="account__accordion">
                <span class="account__subTitle">Вы можете изменить пароль для входа в аккаунт</span>
                <div class="account__accordionWrapper">
                  <div class="account__accordionInner">
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Текущий пароль</span>
                        <Input
                          name="oldPass"
                          placeholder="Введите пароль"
                          type={InputType.Password}
                          autocomplete={AutocompleteType.Password}
                          maxLength={MAX_PASSWORD_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.changePasswordForm.oldPass.isValid}
                          onInput={(e) =>
                            handleChangePasswordFormChange("oldPass", (e.target as HTMLInputElement).value)
                          }
                        >
                          {accountStore.changePasswordForm.oldPass.value}
                        </Input>
                      </label>
                      <HintForInput
                        errorText={accountStore.changePasswordForm.oldPass.error}
                        isError={!accountStore.changePasswordForm.oldPass.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Новый пароль</span>
                        <Input
                          name="newPass"
                          placeholder="Введите пароль"
                          type={InputType.Password}
                          autocomplete={AutocompleteType.NewPassword}
                          maxLength={MAX_PASSWORD_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.changePasswordForm.newPass.isValid}
                          onInput={(e) =>
                            handleChangePasswordFormChange("newPass", (e.target as HTMLInputElement).value)
                          }
                        >
                          {accountStore.changePasswordForm.newPass.value}
                        </Input>
                      </label>
                      <HintForInput
                        hintText={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы [a-z] и цифры [0-9]`}
                        errorText={accountStore.changePasswordForm.newPass.error}
                        isError={!accountStore.changePasswordForm.newPass.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
                    <div class="account__field">
                      <label class="account__label">
                        <span class="account__labelText">Повторите пароль</span>
                        <Input
                          name="repeatNewPass"
                          placeholder="Введите пароль"
                          type={InputType.Password}
                          autocomplete={AutocompleteType.NewPassword}
                          maxLength={MAX_PASSWORD_LENGTH}
                          testId={DEFAULT_TEST_ID}
                          disabled={isAccountActionLoading()}
                          error={!accountStore.changePasswordForm.repeatNewPass.isValid}
                          onInput={(e) =>
                            handleChangePasswordFormChange("repeatNewPass", (e.target as HTMLInputElement).value)
                          }
                        >
                          {accountStore.changePasswordForm.repeatNewPass.value}
                        </Input>
                      </label>
                      <HintForInput
                        errorText={accountStore.changePasswordForm.repeatNewPass.error}
                        isError={!accountStore.changePasswordForm.repeatNewPass.isValid}
                        testId={DEFAULT_TEST_ID}
                      />
                    </div>
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
            </Accordion>
          </Match>
        </Switch>
      </div>
      <Divider />
      <div class="account__section">
        <Accordion
          title={"Управление аккаунтом"}
          size={AccordionSize.Large}
          theme={AccordionTheme.Secondary}
          testId={DEFAULT_TEST_ID}
        >
          <div class="account__accordion">
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
        </Accordion>
      </div>

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
