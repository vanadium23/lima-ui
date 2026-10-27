// utilities.request-auth, ported. *-JSON fields hold the raw response
// text (donor clj-http :body string), *-parsed fields the parsed body.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import {
  confirmResetPasswordRoute,
  loginRoute,
  resetPasswordRoute,
  verifyEmailRoute,
} from "./routes.ts";
import { attemptToHandleEssenceReturnStatusAndErrors, type StatusAndErrors } from "./requestEssence.ts";

const requestLoginUser = (
  userData: Record<string, unknown>,
): Promise<ApiResponse> =>
  request("POST", loginRoute(), { body: userData.userData });

export interface LoginResult {
  status: number;
  loginResultJson: string;
  loginResultParsed: unknown;
  userData: unknown;
}

export const requestLoginUserParsed = async (
  userData: Record<string, unknown>,
): Promise<LoginResult> => {
  const userResult = await requestLoginUser(userData);
  return {
    status: userResult.status,
    loginResultJson: userResult.text,
    loginResultParsed: parseBodyFromJson(userResult),
    userData: userData.userData,
  };
};

export const attemptToLoginUserReturnStatusAndErrors = async (
  userData: Record<string, unknown>,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(await requestLoginUser(userData));

export const requestVerifyEmail = (token: string): Promise<ApiResponse> =>
  request("POST", verifyEmailRoute(), { body: { token } });

export interface VerifyEmailResult {
  status: number;
  verifyResultJson: string;
  verifyResultParsed: unknown;
}

export const requestVerifyEmailParsed = async (
  token: string,
): Promise<VerifyEmailResult> => {
  const verifyResult = await requestVerifyEmail(token);
  return {
    status: verifyResult.status,
    verifyResultJson: verifyResult.text,
    verifyResultParsed: parseBodyFromJson(verifyResult),
  };
};

export const attemptToVerifyEmailReturnStatusAndErrors = async (
  token: string,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(await requestVerifyEmail(token));

export const requestPasswordReset = (data: unknown): Promise<ApiResponse> =>
  request("POST", resetPasswordRoute(), { body: data });

export const requestPasswordResetParsed = async (
  data: unknown,
): Promise<Record<string, unknown>> => {
  const result = await requestPasswordReset(data);
  return {
    status: result.status,
    passwordResetResultJson: result.text,
    passwordResetResultParsed: parseBodyFromJson(result),
  };
};

export const attemptToRequestPasswordResetReturnStatusAndErrors = async (
  data: unknown,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(await requestPasswordReset(data));

export const requestPasswordResetConfirm = (data: unknown): Promise<ApiResponse> =>
  request("POST", confirmResetPasswordRoute(), { body: data });

export const requestPasswordResetConfirmParsed = async (
  data: unknown,
): Promise<Record<string, unknown>> => {
  const result = await requestPasswordResetConfirm(data);
  return {
    status: result.status,
    resetPasswordConfirmResultJson: result.text,
    resetPasswordConfirmResultParsed: parseBodyFromJson(result),
  };
};

export const attemptToRequestPasswordResetConfirmReturnStatusAndErrors = async (
  data: unknown,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestPasswordResetConfirm(data),
  );
