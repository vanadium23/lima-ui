// Standalone dev-users seeding entry point: lets operators create the
// dev accounts without booting the HTTP server. The server seeds the
// same users itself at boot only when DEV=true; this entry point
// creates them on demand regardless.
process.env.NODE_ENV ??= "development";

const main = async (): Promise<void> => {
  process.exitCode = 1;
  const dotenv = await import("dotenv");
  dotenv.config();
  const { loadConfig } = await import("../config.ts");
  const { connectDatabase } = await import("../db.ts");
  const { createDevUsers } = await import("../domain/user.ts");
  const created = await createDevUsers((await connectDatabase(loadConfig()))
    .database);
  process.stdout.write(`Dev users ensured (${created} known accounts).\n`);
  process.exitCode = 0;
};

main()
  .catch((error: unknown) => {
    process.stderr.write(`Dev users seeding failed: ${String(error)}\n`);
  })
  .finally(() => process.exit(process.exitCode ?? 0));
