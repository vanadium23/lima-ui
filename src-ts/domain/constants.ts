// Shared string constants mirroring the Clojure sources: error ids/texts
// (src/server/errors.clj), user validation errors
// (src/auth/errors/user_errors.clj), route paths (server.routes.*),
// token prefix (src/auth/domain/token.clj) and session TTLs
// (src/config.clj static-config).
export const ERRORS = {
  generalSvernik: {
    id: "general-svernik-error",
    text: "General Svernik error occurred.",
  },
  resourceNotFound: {
    id: "resource-not-found",
    text: "Requested resource not found.",
  },
  methodNotAllowed: {
    id: "HTTP-method-not-allowed",
    text: "The applied HTTP method is not allowed for this route.",
  },
  invalidJSON: {
    id: "invalid-JSON",
    text: "The provided JSON is invalid, consider analyzing it via some JSON validation tool.",
  },
  userUnauthorized: {
    id: "user-unauthorized",
    text: "User unauthorized.",
  },
} as const;

export const USER_ERRORS = {
  emailMissing: {
    id: "email-missing",
    text: "The required user's 'email' field is missing.",
  },
  emailEmpty: {
    id: "email-empty",
    text: "The required user's 'email' field should not be empty.",
  },
  emailIncorrect: {
    id: "email-incorrect",
    text: "The required user's 'email' field is incorrect.",
  },
  emailInvalid: {
    id: "email-invalid",
    text: "The required user's 'email' field is not a valid email address.",
  },
  passwordMissing: {
    id: "password-missing",
    text: "The required user's 'password' field is missing.",
  },
  passwordEmpty: {
    id: "password-empty",
    text: "The required user's 'password' field should not be empty.",
  },
  passwordIncorrect: {
    id: "password-incorrect",
    text: "The required user's 'password' field is incorrect.",
  },
  passwordWrong: {
    id: "password-wrong",
    text: "The provided password is incorrect.",
  },
  passwordTooLong: {
    id: "password-too-long",
    text: "The required user's 'password' field should be at most 64 characters long.",
  },
  // auth.errors.user-errors, verbatim: registration/update/verify set.
  passwordWeak: {
    id: "password-weak",
    text: "The required user's 'password' field should be at least 8 characters long.",
  },
  passwordConfirmationMismatch: {
    id: "password-confirmation-mismatch",
    text: "The 'password-confirmation' field should match the 'password' field.",
  },
  emailGeneralError: {
    id: "email-general-error",
    text: "We cannot process this registration at this time.",
  },
  nameIncorrect: {
    id: "name-incorrect",
    text: "The optional user's 'name' field should be the string.",
  },
  nameTooLong: {
    id: "name-too-long",
    text: "The optional user's 'name' field should be no longer than 32 characters.",
  },
  userUpdateEmpty: {
    id: "user-update-empty",
    text: "No update data is provided.",
  },
  userUpdateIncorrect: {
    id: "user-update-incorrect",
    text: "The provided update data is incorrect.",
  },
  emailUpdateNotAllowed: {
    id: "email-update-not-allowed",
    text: "The 'email' field is not updatable.",
  },
  passwordUpdateNotImplemented: {
    id: "password-update-not-implemented",
    text: "The 'password' field update is not implemented.",
  },
  loginDataMissing: {
    id: "request-empty",
    text: "The provided login data is empty.",
  },
} as const;

// src/auth/errors/token_errors.clj — verbatim.
export const TOKEN_ERRORS = {
  tokenInvalid: {
    id: "token-invalid",
    text: "The provided token is invalid or has already been used.",
  },
  tokenMissing: { id: "token-missing", text: "The token field is required." },
  tokenEmpty: { id: "token-empty", text: "The token field cannot be empty." },
  tokenIncorrect: {
    id: "token-incorrect",
    text: "The token field is incorrect.",
  },
} as const;

// src/auth/errors/password_reset_errors.clj — verbatim.
export const PASSWORD_RESET_ERRORS = {
  passwordResetIncorrect: {
    id: "password-reset-incorrect",
    text: "The provided password-reset data is incorrect.",
  },
} as const;

// src/config.clj static-config: password/name limits.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const NAME_MAX_LENGTH = 32;

// Contract v2 (2026-10-27, owner's decision): the whole API lives under
// the /api prefix, so the UI owns the root paths and the container
// exposes a single port. The .feature files carry no URLs — the paths
// live in step implementations only, so the frozen feature texts and
// the Clojure donor steps (root paths against the root-path backend)
// are untouched.
const API = "/api";

export const ROUTES = {
  home: `${API}/`,
  login: `${API}/auth/login`,
  verifyEmail: `${API}/auth/verify-email`,
  resetPassword: `${API}/auth/reset-password`,
  confirmResetPassword: `${API}/auth/reset-password/confirm`,
  users: `${API}/users`,
  profile: `${API}/users/me`,
  lists: `${API}/lists`,
  searchLists: `${API}/search/lists`,
  countLists: `${API}/count/lists`,
  list: `${API}/lists/:listId`,
  items: `${API}/items`,
  item: `${API}/items/:itemId`,
  clearListsAndItems: `${API}/clear-lists-and-items`,
  clearUsers: `${API}/clear-users`,
} as const;

// Clojure auth.user-sessions.create: (generate-token-value "ses") —
// the "ses" argument IS the prefix, no fallback applies (the default
// "tok" branch is only for unknown types).
export const SESSION_TOKEN_PREFIX = "ses";
// 32 random bytes, base64url without padding (auth.domain.token.clj).
export const SESSION_TOKEN_RANDOM_BYTES = 32;
// src/config.clj static-config.
export const SESSION_MAX_AGE_DAYS = 90;
