// Password hashing and verification for auth + dev-user seeding.
// bcrypt cost 12, the work factor of the donor (auth.utilities
// .password-management: buddy.hashers :bcrypt :cost 12).
// Native @node-rs/bcrypt, not pure-JS bcryptjs: the hash is computed off
// the event loop. bcryptjs kept the single thread busy for the whole
// ~0.35 s round, so every login froze all other requests and parallel
// logins serialized. The stored form is the standard bcrypt string
// ($2a/$2b/$2y), so hashes written by the donor or by bcryptjs verify
// unchanged.
import { hash, verify } from "@node-rs/bcrypt";

export const PASSWORD_HASH_COST = 12;

export const bcryptHash = (password: string): Promise<string> =>
  hash(password, { cost: PASSWORD_HASH_COST });

// A malformed stored hash rejects rather than resolving false: callers
// that treat "cannot verify" as "wrong password" add .catch(() => false).
export const bcryptVerify = (password: string, storedHash: string): Promise<boolean> =>
  verify(password, storedHash);
