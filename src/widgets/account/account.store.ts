import { createStore } from "solid-js/store";

import { MIN_PASSWORD_LENGTH } from "../../../configuration.ts";
import type { AuthButtonIconName } from "../../components/authButton/authButton.tsx";

export type AuthServiceId = "google" | "vk" | "yandex" | "email";

export interface ConnectedAccount {
  id: AuthServiceId;
  name: string;
  value: string;
  isConnected: boolean;
  iconName?: AuthButtonIconName;
}

export interface EmailFormField {
  value: string;
  isValid: boolean;
  error: string;
}

interface AccountState {
  connectedAccounts: ConnectedAccount[];
  unlinkingServiceId: AuthServiceId | null;
  serviceToUnlink: ConnectedAccount | null;
  linkingServiceId: AuthServiceId | null;
  emailForm: {
    email: EmailFormField;
    pass: EmailFormField;
    repeatPass: EmailFormField;
    isLoading: boolean;
  };
  changePasswordForm: {
    oldPass: EmailFormField;
    newPass: EmailFormField;
    repeatNewPass: EmailFormField;
    isLoading: boolean;
  };
  deleteAccountForm: {
    isOpen: boolean;
    confirmWord: string;
    isLoading: boolean;
  };
}

const initialConnectedAccounts: ConnectedAccount[] = [
  { id: "email", name: "Эл. почта", value: "example@gmail.com", isConnected: false },
  { id: "google", name: "Google", value: "google-user@gmail.com", isConnected: true, iconName: "google" },
  { id: "vk", name: "VK ID", value: "vk-user", isConnected: false, iconName: "vk" },
  { id: "yandex", name: "Яндекс ID", value: "yandex-user", isConnected: false, iconName: "yandex" },
];

export const [accountStore, setAccountStore] = createStore<AccountState>({
  connectedAccounts: initialConnectedAccounts,
  unlinkingServiceId: null,
  serviceToUnlink: null,
  linkingServiceId: null,
  emailForm: {
    email: { value: "", isValid: true, error: "" },
    pass: { value: "", isValid: true, error: "" },
    repeatPass: { value: "", isValid: true, error: "" },
    isLoading: false,
  },
  changePasswordForm: {
    oldPass: { value: "", isValid: true, error: "" },
    newPass: { value: "", isValid: true, error: "" },
    repeatNewPass: { value: "", isValid: true, error: "" },
    isLoading: false,
  },
  deleteAccountForm: {
    isOpen: false,
    confirmWord: "",
    isLoading: false,
  },
});

const mockApiDelay = () => new Promise((resolve) => setTimeout(resolve, 2000));

export const handleEmailFormChange = (field: "email" | "pass" | "repeatPass", value: string) => {
  setAccountStore("emailForm", field, { value, isValid: true, error: "" });
};

export const handleChangePasswordFormChange = (field: "oldPass" | "newPass" | "repeatNewPass", value: string) => {
  setAccountStore("changePasswordForm", field, { value, isValid: true, error: "" });
};

export const changePassword = async () => {
  const { oldPass, newPass, repeatNewPass } = accountStore.changePasswordForm;

  const isOldPassValid = oldPass.value.length >= MIN_PASSWORD_LENGTH;
  const isNewPassValid = newPass.value.length >= MIN_PASSWORD_LENGTH;
  const isRepeatNewPassValid = newPass.value === repeatNewPass.value;

  setAccountStore("changePasswordForm", "oldPass", "isValid", isOldPassValid);
  setAccountStore("changePasswordForm", "oldPass", "error", isOldPassValid ? "" : "Пароль слишком короткий");
  setAccountStore("changePasswordForm", "newPass", "isValid", isNewPassValid);
  setAccountStore("changePasswordForm", "newPass", "error", isNewPassValid ? "" : "Пароль слишком короткий");
  setAccountStore("changePasswordForm", "repeatNewPass", "isValid", isRepeatNewPassValid);
  setAccountStore("changePasswordForm", "repeatNewPass", "error", isRepeatNewPassValid ? "" : "Пароли не совпадают");

  if (!isOldPassValid || !isNewPassValid || !isRepeatNewPassValid) {
    return;
  }

  setAccountStore("changePasswordForm", "isLoading", true);

  await mockApiDelay();

  setAccountStore("changePasswordForm", {
    oldPass: { value: "", isValid: true, error: "" },
    newPass: { value: "", isValid: true, error: "" },
    repeatNewPass: { value: "", isValid: true, error: "" },
    isLoading: false,
  });
};

export const linkEmail = async () => {
  const { email, pass, repeatPass } = accountStore.emailForm;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const isPassValid = pass.value.length >= 8; // DOC Упрощенная проверка для примера, можно использовать validatePassword
  const isRepeatPassValid = pass.value === repeatPass.value;

  setAccountStore("emailForm", "email", "isValid", isEmailValid);
  setAccountStore("emailForm", "email", "error", isEmailValid ? "" : "Неверный формат почты");
  setAccountStore("emailForm", "pass", "isValid", isPassValid);
  setAccountStore("emailForm", "pass", "error", isPassValid ? "" : "Пароль слишком короткий");
  setAccountStore("emailForm", "repeatPass", "isValid", isRepeatPassValid);
  setAccountStore("emailForm", "repeatPass", "error", isRepeatPassValid ? "" : "Пароли не совпадают");

  if (!isEmailValid || !isPassValid || !isRepeatPassValid) {
    return;
  }

  setAccountStore("emailForm", "isLoading", true);

  await mockApiDelay();

  setAccountStore("connectedAccounts", (acc) => acc.id === "email", {
    isConnected: true,
    value: accountStore.emailForm.email.value,
  });
  setAccountStore("emailForm", {
    email: { value: "", isValid: true, error: "" },
    pass: { value: "", isValid: true, error: "" },
    repeatPass: { value: "", isValid: true, error: "" },
    isLoading: false,
  });
};

export const unlinkService = async (id: AuthServiceId) => {
  setAccountStore("unlinkingServiceId", id);

  await mockApiDelay();

  setAccountStore("connectedAccounts", (acc) => acc.id === id, "isConnected", false);
  setAccountStore("unlinkingServiceId", null);
};

export const setServiceToUnlink = (account: ConnectedAccount | null) => {
  setAccountStore("serviceToUnlink", account);
};

export const confirmUnlinkService = async () => {
  const account = accountStore.serviceToUnlink;

  if (account) {
    const id = account.id;
    setAccountStore("serviceToUnlink", null);
    await unlinkService(id);
  }
};

export const linkService = async (id: AuthServiceId) => {
  setAccountStore("linkingServiceId", id);

  await mockApiDelay();

  setAccountStore("connectedAccounts", (acc) => acc.id === id, "isConnected", true);
  setAccountStore("linkingServiceId", null);
};

export const setDeleteAccountDialogOpen = (isOpen: boolean) => {
  setAccountStore("deleteAccountForm", "isOpen", isOpen);

  if (!isOpen) {
    setAccountStore("deleteAccountForm", "confirmWord", "");
  }
};

export const handleDeleteAccountConfirmWordChange = (value: string) => {
  setAccountStore("deleteAccountForm", "confirmWord", value);
};

export const deleteAccount = async () => {
  if (accountStore.deleteAccountForm.confirmWord.toUpperCase() !== "УДАЛИТЬ") {
    return;
  }

  setAccountStore("deleteAccountForm", "isLoading", true);

  await mockApiDelay();

  setAccountStore("deleteAccountForm", {
    isOpen: false,
    confirmWord: "",
    isLoading: false,
  });
};
