// Environment configuration, validated with zod at boot. Mirrors the
// env keys the Clojure backend reads via cprop (config.clj); missing
// values fail fast with a clear message instead of a deep stack.
import z from "zod";

const portSchema = z.coerce.number().int().positive();

const rawConfigSchema = z.object({
  PORT: portSchema.default(3000),
  MONGO_HOST: z.string().min(1),
  MONGO_PORT: portSchema,
  MONGO_USER: z.string().min(1),
  MONGO_PASSWORD: z.string(),
  SESSION_HMAC_SECRET: z.string().min(1),
  DEV: z
    .string()
    .default("false")
    .refine((value) => ["true", "false"].includes(value), {
      message: "DEV must be 'true' or 'false'",
    }),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: portSchema.default(2500),
  SMTP_FROM: z.string().default("test@localhost"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  // Public URL of this server; essence URL fields point here (the
  // Clojure code reads the same key from cprop env).
  SERVER_URL: z.string().url().default("http://localhost:3000"),
  // Public site URL for email links (email_send.clj reads the same
  // client-address key; .env points it at the frontend dev server).
  CLIENT_ADDRESS: z.string().url().default("http://localhost:4321"),
});

export type RawConfig = z.infer<typeof rawConfigSchema>;

export interface Config {
  port: number;
  mongoUri: string;
  sessionHmacSecret: string;
  dev: boolean;
  serverUrl: string;
  clientAddress: string;
  smtpHost: string;
  smtpPort: number;
  smtpFrom: string;
}

export const mongoUriFrom = (raw: RawConfig): string =>
  `mongodb://${encodeURIComponent(raw.MONGO_USER)}:` +
  `${encodeURIComponent(raw.MONGO_PASSWORD)}` +
  `@${raw.MONGO_HOST}:${raw.MONGO_PORT}`;

// Reads and validates the environment synchronously; a missing required
// variable aborts the process with a readable message.
export const loadConfig = (
  env: NodeJS.ProcessEnv = process.env,
): Config => {
  const parsed = rawConfigSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid configuration environment: ${details}.`);
  }
  const raw = parsed.data;
  return {
    port: raw.PORT,
    mongoUri: mongoUriFrom(raw),
    sessionHmacSecret: raw.SESSION_HMAC_SECRET,
    dev: raw.DEV === "true",
    serverUrl: raw.SERVER_URL.replace(/\/+$/, ""),
    clientAddress: raw.CLIENT_ADDRESS.replace(/\/+$/, ""),
    smtpHost: raw.SMTP_HOST,
    smtpPort: raw.SMTP_PORT,
    smtpFrom: raw.SMTP_FROM,
  };
};
