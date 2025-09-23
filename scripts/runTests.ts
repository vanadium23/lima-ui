#!/usr/bin/env node
import chalk from "chalk";
import { spawn } from "child_process";
import { Command } from "commander";

import { DEVICE_PROFILES, DeviceProfiles } from "../features/config/deviceProfiles.ts";
import { RESULTS_FOLDER } from "../features/config/results.ts";
import { prepareEmptyTracesFolder } from "../features/utilities/traces.ts";

interface TestConfig {
  tags: string[];
  debug: boolean;
  visible: boolean;
  devices: DeviceProfiles[];
  verbose: boolean;
  retry: number;
}

// Parse command line arguments
const program = new Command();

program
  .addHelpText(
    "beforeAll",
    chalk.blue.bold("\nЗапуск тестов для Lima UI\n") +
      chalk.blue("============================\n\n") +
      "Запуск тестов для различных устройств с различными опциями.\n",
  )
  .name("npm test")
  .description("Запуск тестов с различными опциями.")
  .option("-d, --desktop", "Запуск тестов для десктопа.")
  .option("-t, --tablet", "Запуск тестов для планшета.")
  .option("-m, --mobile", "Запуск тестов для мобильного.")
  .option("-c, --current", "Запуск только тестов с тегом @current.")
  .option("--not-heavy", "Запуск всех тестов, кроме тех, что с тегом @heavy")
  .option("-b, --broken", "Запуск только тестов с тегом @broken.")
  .option("--debug", "Запуск в режиме отладки")
  .option("--visible", "Запуск браузера в видимом режиме и сохранение открытым после тестов")
  .option("--fail-fast", "Остановка выполнения тестов после первой ошибки")
  .option("--verbose", "Отображение имени сценария и прогресса в виде точек")
  .option("--retry <number>", "Количество попыток перезапуска упавших тестов", "0")
  .addHelpText(
    "afterAll",
    chalk.yellow("\nПримеры использования:\n") +
      "  npm run test                            # Запуск всех тестов для всех устройств\n" +
      "  npm run test -- --desktop               # Запуск тестов только для десктопа\n" +
      "  npm run test -- --tablet --mobile       # Запуск тестов для планшета и мобильного\n" +
      "  npm run test -- --current               # Запуск только текущих тестов\n" +
      "  npm run test -- --broken                # Запуск только сломанных тестов\n" +
      "  npm run test -- --not-heavy             # Запуск всех тестов, кроме тех, что с тегом @heavy\n" +
      "  npm run test -- --desktop --current     # Запуск текущих тестов для десктопа\n" +
      "  npm run test -- --desktop --debug       # Запуск десктоп тестов в режиме отладки\n" +
      "  npm run test -- --fail-fast             # Остановка после первой ошибки\n" +
      "  npm run test -- --verbose # Форматтер прогресса по сценариям\n" +
      "  npm run test -- --retry 2               # Перезапуск упавших тестов до 2 раз\n" +
      "  npm run test -- --help                  # Показать эту справку\n\n" +
      chalk.cyan("Использование тегов:\n") +
      "  @current - добавьте к сценарию для запуска только его:\n" +
      "    npm run test -- --current\n" +
      "  @trace - добавьте для сохранения трассировки независимо от результата:\n" +
      "    Добавьте тег к сценарию и запустите обычным способом\n" +
      "  @broken - добавьте к временно неработающим тестам:\n" +
      "    npm run test -- --broken\n" +
      "  @heavy - добавьте к тяжелым тестам, которые нужно исключить из облегчённого прогона:\n" +
      "    npm run test -- --not-heavy\n\n",
  )
  .showHelpAfterError("(run `npm test -- --help` для справки)");

program.parse(process.argv);

const config: TestConfig = {
  devices: [],
  tags: ["not @broken"], // Default: exclude broken tests
  debug: program.opts().debug || false,
  visible: program.opts().visible || false,
  verbose: program.opts().verbose || false,
  retry: parseInt(program.opts().retry || "0", 10),
};

const { desktop, tablet, mobile, broken, current, notHeavy, failFast } = program.opts();

if (!desktop && !tablet && !mobile) {
  config.devices = [DeviceProfiles.desktop, DeviceProfiles.tablet, DeviceProfiles.mobile];
} else {
  if (desktop) config.devices.push(DeviceProfiles.desktop);
  if (tablet) config.devices.push(DeviceProfiles.tablet);
  if (mobile) config.devices.push(DeviceProfiles.mobile);
}

if (broken) {
  config.tags = ["@broken"];
} else if (current) {
  config.tags = ["@current"];
} else if (notHeavy) {
  config.tags = ["not @broken and not @heavy"];
}

runTests().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});

async function runTests() {
  console.log(chalk.blue.bold("\nStarting tests with configuration:"));
  console.log(`- Devices: ${config.devices.join(", ")}`);
  console.log(`- Tags: ${config.tags.join(", ")}`);
  console.log(`- Debug: ${config.debug ? "enabled" : "disabled"}`);
  console.log(`- Visible mode: ${config.visible ? "enabled" : "disabled"}`);
  console.log(`- Not heavy mode: ${notHeavy ? "enabled" : "disabled"}`);
  console.log(`- Fail fast: ${failFast ? "enabled" : "disabled"}`);
  console.log(`- Verbose: ${config.verbose ? "enabled" : "disabled"}`);
  console.log(`- Retry: ${config.retry}\n`);

  console.log(chalk.greenBright("\nTraces folder cleared"));
  prepareEmptyTracesFolder();

  const results: { device: DeviceProfiles; success: boolean }[] = [];
  let hasError = false;

  for (const device of config.devices) {
    logDeviceInfo(device);

    try {
      const command = "npx";
      const args = ["cucumber-js"];

      // Add device-specific report paths to prevent overwriting reports
      const deviceReportSuffix = `-${device}`;
      const resultsFolder = RESULTS_FOLDER.join("/");
      args.push(
        "--format",
        `html:${resultsFolder}/reports/cucumber-report${deviceReportSuffix}.html`,
        "--format",
        `json:${resultsFolder}/reports/cucumber-report${deviceReportSuffix}.json`,
      );

      if (failFast) {
        args.push("--fail-fast");
      }

      if (config.tags.length > 0) {
        const escapeTagsWithSpaces = (tag: string): string => `"${tag}"`;
        args.push("--tags", config.tags.map(escapeTagsWithSpaces).join(" and "));
      }

      // Add import for TypeScript support
      args.push("--import", "tsx/cucumber/import");

      if (config.verbose) {
        args.push("--format", "./scripts/perScenarioProgressFormatter.ts");
      }

      if (config.retry > 0) {
        args.push("--retry", config.retry.toString());
      }

      const nodeOptions = [process.env.NODE_OPTIONS || "", "--no-warnings", "--loader ts-node/esm"]
        .filter(Boolean)
        .join(" ");

      const env = {
        ...process.env,
        DEVICE_PROFILE: device,
        ...(config.debug ? { PWDEBUG: "1", DEBUG: "cucumber" } : {}),
        ...(config.visible ? { BROWSER_VISIBLE: "1" } : {}),
        NODE_OPTIONS: nodeOptions,
        NODE_PATH: process.env.NODE_PATH || "",
        PATH: process.env.PATH || "",
      };

      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        cwd: process.cwd(), // Explicitly set working directory
        env: env,
      });

      const exitCode = await new Promise<number>((resolve) => {
        child.on("close", resolve);
      });

      const success = exitCode === 0;
      results.push({ device, success });

      if (!success) {
        hasError = true;
        console.log(chalk.red(`\n❌ Tests failed for ${device}\n`));
      } else {
        console.log(chalk.green(`\n✅ Tests passed for ${device}\n`));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error running tests for ${device}:`), error);
      hasError = true;
      results.push({ device, success: false });
    }
  }

  console.log("\n" + chalk.blue.bold("Test Summary:") + "\n" + "=".repeat(30));
  results.forEach(({ device, success }) => {
    const status = success ? chalk.green("PASS") : chalk.red("FAIL");
    console.log(`${device.padEnd(10)} ${status}`);
  });
  console.log("=".repeat(30));

  process.exit(hasError ? 1 : 0);
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

function logDeviceInfo(device: string) {
  const deviceProfile = DEVICE_PROFILES[device as DeviceProfiles] || DEVICE_PROFILES.desktop;

  const header = chalk.bgBlue.bold(" TEST DEVICE: ");
  const deviceHeader = chalk.cyan.bold(device.toUpperCase());

  const deviceInfo = [
    `${chalk.dim("• Viewport:")} ${deviceProfile.viewport.width}x${deviceProfile.viewport.height}`,
    `${chalk.dim("• Mobile:")} ${deviceProfile.isMobile ? "Yes" : "No"}`,
    `${chalk.dim("• Touch:")} ${deviceProfile.hasTouch ? "Yes" : "No"}`,
    `${chalk.dim("• Pixel Ratio:")} ${deviceProfile.deviceScaleFactor}`,
  ].join("\n");

  // Add some spacing and a separator line
  console.log("\n" + "=".repeat(60));
  console.log(header, deviceHeader);
  console.log("\n" + deviceInfo);
  console.log("-".repeat(60) + "\n");
}
