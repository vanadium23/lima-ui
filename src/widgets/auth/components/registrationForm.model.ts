import {
  REG_ACCEPT_POLICE,
  REG_EMAIL_INPUT,
  REG_PASS_INPUT,
  REG_REPEAT_PASS_INPUT,
} from "../../../../features/testIds.ts";
import { InputType } from "../../../components/input/input.tsx";
import type { AuthFormInput } from "../auth.model.ts";

export type RegistrationFormInputsNames = "email" | "pass" | "repeat_pass" | "accept_police";
export type RegistrationFormInputs = Record<RegistrationFormInputsNames, AuthFormInput>;

export const initialRegistrationFormInputs: RegistrationFormInputs = {
  email: {
    id: REG_EMAIL_INPUT,
    value: "",
    type: InputType.Email,
    isValid: true,
  },
  pass: {
    id: REG_PASS_INPUT,
    value: "",
    type: InputType.Password,
    isValid: true,
  },
  repeat_pass: {
    id: REG_REPEAT_PASS_INPUT,
    value: "",
    type: InputType.Password,
    isValid: true,
  },
  accept_police: {
    id: REG_ACCEPT_POLICE,
    value: false,
    type: "checkbox",
    isValid: true,
  },
};
