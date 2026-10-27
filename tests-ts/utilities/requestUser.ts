// utilities.request-user, ported. *-JSON fields hold the raw response
// text (donor clj-http :body string), *-parsed fields the parsed body.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { profileRoute, usersRoute } from "./routes.ts";
import { attemptToHandleEssenceReturnStatusAndErrors, type StatusAndErrors } from "./requestEssence.ts";

const requestRegisterUser = (
  userData: Record<string, unknown>,
): Promise<ApiResponse> =>
  request("POST", usersRoute(), { body: userData.userData });

export interface RegisterUserResult {
  status: number;
  userResultJson: string;
  userResultParsed: unknown;
  userData: unknown;
}

export const requestRegisterUserParsed = async (
  userData: Record<string, unknown>,
): Promise<RegisterUserResult> => {
  const userResult = await requestRegisterUser(userData);
  return {
    status: userResult.status,
    userResultJson: userResult.text,
    userResultParsed: parseBodyFromJson(userResult),
    userData: userData.userData,
  };
};

export const attemptToRegisterUserReturnStatusAndErrors = async (
  userData: Record<string, unknown>,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(await requestRegisterUser(userData));

export const requestUserProfile = (
  token: string | undefined,
): Promise<ApiResponse> => request("GET", profileRoute(), { token });

export interface UserProfileResult {
  status: number;
  profileResultJson: string;
  profileResultParsed: unknown;
}

export const requestUserProfileParsed = async (
  token: string | undefined,
): Promise<UserProfileResult> => {
  const userResult = await requestUserProfile(token);
  return {
    status: userResult.status,
    profileResultJson: userResult.text,
    profileResultParsed: parseBodyFromJson(userResult),
  };
};

export const attemptToFetchUserProfileReturnStatusAndErrors = async (
  token: string | undefined,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(await requestUserProfile(token));

export const requestUserUpdate = (
  token: string | undefined,
  userData: unknown,
): Promise<ApiResponse> =>
  request("PATCH", profileRoute(), { body: userData, token });

export const requestUserUpdateParsed = async (
  token: string | undefined,
  userData: unknown,
): Promise<Record<string, unknown>> => {
  const updateResult = await requestUserUpdate(token, userData);
  return {
    status: updateResult.status,
    updateResultJson: updateResult.text,
    updateResultParsed: parseBodyFromJson(updateResult),
  };
};

export const attemptToUpdateUserReturnStatusAndErrors = async (
  token: string | undefined,
  userData: unknown,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestUserUpdate(token, userData),
  );
