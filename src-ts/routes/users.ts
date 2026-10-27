// /users route surface. Mirrors src/server/routes/users.clj:
// HEAD /users → empty-details, POST /users → create-user-or-respond-
// with-error (gather → 400 | insert → registration token → email →
// 200 {id}); /users/me keeps the protected GET/HEAD profile plus the
// real PATCH update (update-user-or-respond-with-error: the password
// error class answers 501, other errors 400, success 200 profile).
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { Db } from "mongodb";
import {
  createUserFromRawData,
  createRegistrationToken,
  updateUserFromRawData,
} from "../auth/users.ts";
import { COLLECTIONS, EMAIL_FIELD, ID_FIELD } from "../domain/fields.ts";
import { ROUTES } from "../domain/constants.ts";
import type { ProtectedRouteDependencies } from "./protected-skeletons.ts";
import { authPreHandler } from "./protected-skeletons.ts";
import {
  sendRegistrationEmail,
  type EmailDependencies,
} from "../utilities/email-send.ts";
import { sendSortedJSON } from "../utilities/json.ts";
import type { RawEssence } from "../domain/svernik.ts";
import type { UserDocument } from "../auth/users.ts";

export interface UsersRouteDependencies extends ProtectedRouteDependencies {
  email: EmailDependencies;
}

// Placeholder for future user detail endpoint (users.clj empty-details).
const emptyDetails = (_request: FastifyRequest, reply: FastifyReply): void => {
  reply.code(200).send();
};

// insert-user!-return-user: persist the prepared document, then the
// route uses the inserted shape (id + email) for token and email.
const insertUserAndReturn = async (
  database: Db,
  user: UserDocument,
): Promise<UserDocument> => {
  await database
    .collection(COLLECTIONS.users)
    .insertOne(user as never);
  return user;
};

// create-user-or-respond-with-error: 200 {id} ONLY — the user object
// never comes back; registration email carries the rgt_ token link.
const createUserOrRespondWithError = async (
  dependencies: UsersRouteDependencies,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const result = await createUserFromRawData(
    dependencies.database,
    (request.body ?? {}) as RawEssence,
  );
  if ("errors" in result) {
    sendSortedJSON(reply, 400, { errors: result.errors });
    return;
  }
  const insertedUser = await insertUserAndReturn(
    dependencies.database,
    result.user,
  );
  const token = await createRegistrationToken(
    dependencies.database,
    insertedUser.id,
  );
  await sendRegistrationEmail(
    dependencies.email,
    insertedUser.email,
    token,
  );
  sendSortedJSON(reply, 200, { id: insertedUser.id });
};

// update-user-or-respond-with-error: errors with the password class →
// 501 not-implemented, other errors → 400, success → 200 profile.
const updateUserOrRespondWithError = async (
  dependencies: ProtectedRouteDependencies,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const result = await updateUserFromRawData(
    dependencies.database,
    request.body,
    request.user!.id,
  );
  if ("errors" in result) {
    if (result.notImplemented) {
      reply.code(501).send();
      return;
    }
    sendSortedJSON(reply, 400, { errors: result.errors });
    return;
  }
  sendSortedJSON(reply, 200, result.profile);
};

export const registerUsersRoutes = (
  app: FastifyInstance,
  dependencies: UsersRouteDependencies,
): void => {
  app.post(ROUTES.users, (request, reply) =>
    createUserOrRespondWithError(dependencies, request, reply));
  app.head(ROUTES.users, emptyDetails);

  const preHandler = authPreHandler(dependencies);
  // exposeHeadRoute: false — the explicit HEAD registration below is
  // the empty-details handler from users.clj; Fastify's implicit HEAD
  // would collide with it.
  app.get(ROUTES.profile, { preHandler, exposeHeadRoute: false }, (request, reply) => {
    const { id, email, name } = request.user!;
    sendSortedJSON(reply, 200, { id, email, name });
  });
  app.head(ROUTES.profile, { preHandler }, emptyDetails);
  app.patch(ROUTES.profile, { preHandler }, (request, reply) =>
    updateUserOrRespondWithError(dependencies, request, reply));
};
