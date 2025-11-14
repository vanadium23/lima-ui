import { InputType } from "../../components/input/input.tsx";

export type AuthType = "email" | "google" | "yandex" | "vk";

export type AuthFormInput = {
  id: string;
  value: string | boolean;
  type: InputType | "checkbox";
  isValid: boolean;
  error?: string;
};
