// POST /auth/login (server.routes/auth.clj): body errors → 400, success
// → 200 {token, createdAt}. The remaining /auth/* endpoints are real
// now (ET-210): verify-email (one-time registration token → session),
// reset-password (always-ok anti-enumeration request) and
// reset-password/confirm (one-time reset token → new password →
// session); HEAD stays the empty-details surface.
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { attemptLogin, type ErrorPayload } from "../auth/middleware.ts";
import {
  createPasswordResetToken,
  requestPasswordResetFromRawData,
  resetPasswordConfirmFromRawData,
  verifyUserEmailFromRawData,
  type AuthActionDependencies,
  type AuthActionResult,
} from "../auth/users.ts";
import { createSession } from "../auth/sessions.ts";
import type { Db } from "mongodb";
import { ROUTES } from "../domain/constants.ts";
import { TOKEN_RESPONSE_FIELD } from "../domain/fields.ts";
import {
  sendPasswordResetEmail,
  type EmailDependencies,
} from "../utilities/email-send.ts";
import { sendSortedJSON } from "../utilities/json.ts";
import type { RawEssence } from "../domain/svernik.ts";
import type { SortedJSONMap } from "../utilities/json.ts";

export interface AuthRouteDependencies {
  database: Db;
  sessionHmacSecret: string;
  email: EmailDependencies;
}

const errorsBody = (errors: ErrorPayload[]): { errors: ErrorPayload[] } => ({
  errors: errors.map((error) => ({ ...error })),
});

const emptyHead = (_request: FastifyRequest, reply: FastifyReply): void => {
  reply.code(200).send();
};

// handle-auth-action: body errors → 400, else 200 result. Success
// shapes already carry the wire keys ("token", "created-at" or the
// reset-password {message "ok"}).
const respondWithActionResult = (
  reply: FastifyReply,
  result: AuthActionResult,
): void => {
  if (result.errors !== undefined) {
    sendSortedJSON(reply, 400, errorsBody(result.errors));
    return;
  }
  sendSortedJSON(reply, 200, result as SortedJSONMap);
};

// Session creation for verify/reset-confirm: the HTTP request's
// user-agent + ip, session age 0 (the Clojure default arity).
const sessionCreator = (dependencies: AuthActionDependencies) =>
  async (options: {
    userId: string;
    userAgent: string;
    ip: string;
  }): Promise<{ token: string; createdAt: string }> => {
    const session = await createSession(dependencies.database, {
      secret: dependencies.secret,
      userId: options.userId,
      sessionAgeInSeconds: 0,
      userAgent: options.userAgent,
      ip: options.ip,
    });
    return { token: session.token ?? "", createdAt: session.createdAt ?? "" };
  };

const requestMeta = (
  request: FastifyRequest,
): { userAgent: string; ip: string } => ({
  userAgent: request.headers["user-agent"] ?? "",
  ip: request.ip,
});

// find-user-by-email for the reset-email branch (only reached when the
// gatherer accepted the email AND the user exists — the "" fallback is
// unreachable in the contract flow).
const findUserIdByEmail = async (
  database: Db,
  email: string,
): Promise<string> => {
  const user = await database.collection("users").findOne({ email });
  return user === null ? "" : String(user.id ?? user._id ?? "");
};

export const registerAuthRoutes = (
  app: FastifyInstance,
  dependencies: AuthRouteDependencies,
): void => {
  const loginDependencies = {
    database: dependencies.database,
    secret: dependencies.sessionHmacSecret,
  };
  const authDependencies: AuthActionDependencies = {
    database: dependencies.database,
    secret: dependencies.sessionHmacSecret,
  };
  app.post(ROUTES.login, async (request, reply) => {
    const result = await attemptLogin(
      loginDependencies,
      request.body,
      request,
    );
    if ("errors" in result) {
      return sendSortedJSON(reply, 400, errorsBody(result.errors));
    }
    return sendSortedJSON(reply, 200, {
      [TOKEN_RESPONSE_FIELD]: result.token,
      // The suite asserts the fieldified Clojure key "created-at".
      "created-at": result.createdAt,
    });
  });
  app.head(ROUTES.login, emptyHead);

  // verify-email: one-time rgt_ token → emailVerified=true → session.
  app.post(ROUTES.verifyEmail, async (request, reply) => {
    const result = await verifyUserEmailFromRawData(
      authDependencies,
      (request.body ?? {}) as RawEssence,
      requestMeta(request),
      sessionCreator(authDependencies),
    );
    respondWithActionResult(reply, result);
  });
  app.head(ROUTES.verifyEmail, emptyHead);

  // reset-password: ALWAYS 200 {message "ok"} — token + email only for
  // a real user (anti-enumeration, reset_password.clj).
  app.post(ROUTES.resetPassword, async (request, reply) => {
    const result = await requestPasswordResetFromRawData(
      dependencies.database,
      request.body,
    );
    if ("sent" in result) {
      const token = await createPasswordResetToken(
        dependencies.database,
        await findUserIdByEmail(dependencies.database, result.email),
      );
      await sendPasswordResetEmail(dependencies.email, result.email, token);
      sendSortedJSON(reply, 200, { message: "ok" });
      return;
    }
    respondWithActionResult(reply, result);
  });
  app.head(ROUTES.resetPassword, emptyHead);

  // reset-password/confirm: one-time rst_ token → new bcrypt password
  // → session ({token, "created-at"} like login).
  app.post(ROUTES.confirmResetPassword, async (request, reply) => {
    const result = await resetPasswordConfirmFromRawData(
      authDependencies,
      (request.body ?? {}) as RawEssence,
      requestMeta(request),
      sessionCreator(authDependencies),
    );
    respondWithActionResult(reply, result);
  });
  app.head(ROUTES.confirmResetPassword, emptyHead);
};
